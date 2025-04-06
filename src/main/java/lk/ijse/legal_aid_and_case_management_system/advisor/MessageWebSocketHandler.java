package lk.ijse.legal_aid_and_case_management_system.advisor;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.ijse.legal_aid_and_case_management_system.dto.MessageDTO;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class MessageWebSocketHandler extends TextWebSocketHandler {
    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private static final Logger log = LoggerFactory.getLogger(MessageWebSocketHandler.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        try {
            log.info("WebSocket connection attempt: URI = {}", session.getUri());
            String query = session.getUri().getQuery();
            if (query == null || !query.contains("token=")) {
                log.warn("Invalid query string: {}", query);
                session.close(CloseStatus.BAD_DATA);
                return;
            }
            String[] queryParts = query.split("token=");
            if (queryParts.length < 2) {
                log.warn("No token found in query: {}", query);
                session.close(CloseStatus.BAD_DATA);
                return;
            }
            String token = queryParts[1];
            log.info("Extracted token: {}", token);
            String email = jwtUtil.getUsernameFromToken(token);
            log.info("Extracted email: {}", email);
            UserDetails userDetails = userService.loadUserByUsername(email);
            if (jwtUtil.validateToken(token, userDetails)) {
                log.info("Token validated successfully for email: {}", email);
                sessions.put(email, session);
            } else {
                log.warn("Token validation failed for email: {}", email);
                session.close(CloseStatus.NOT_ACCEPTABLE);
            }
        } catch (Exception e) {
            log.error("Error in afterConnectionEstablished: {}", e.getMessage(), e);
            session.close(CloseStatus.SERVER_ERROR); // 1011
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            log.info("Received message from {}: {}", session.getId(), message.getPayload());
            String payload = message.getPayload();
            MessageDTO messageDTO = objectMapper.readValue(payload, MessageDTO.class);
            /*messageDTO.setTimestamp(java.time.LocalDateTime.now());*/
            userService.saveMessage(messageDTO);
            WebSocketSession recipientSession = sessions.get(messageDTO.getRecipientEmail());
            if (recipientSession != null && recipientSession.isOpen()) {
                log.info("Sending message to recipient: {}", messageDTO.getRecipientEmail());
                recipientSession.sendMessage(new TextMessage(payload));
            }
            if (session.isOpen()) {
                log.info("Echoing message back to sender");
                session.sendMessage(new TextMessage(payload));
            }
        } catch (Exception e) {
            log.error("Error in handleTextMessage: {}", e.getMessage(), e);
            throw e; // Let Spring handle it
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("Connection closed: {} with status {}", session.getUri(), status);
        sessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
    }

}