package lk.ijse.legal_aid_and_case_management_system.advisor;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.ijse.legal_aid_and_case_management_system.dto.MessageDTO;
import lk.ijse.legal_aid_and_case_management_system.service.UserService;
import lk.ijse.legal_aid_and_case_management_system.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class MessageWebSocketHandler extends TextWebSocketHandler {
    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = session.getUri().getQuery().split("token=")[1];
        String email = jwtUtil.getUsernameFromToken(token);
        if (jwtUtil.validateToken(token, userService.loadUserByUsername(email))) {
            sessions.put(email, session);
        } else {
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        MessageDTO messageDTO = objectMapper.readValue(payload, MessageDTO.class);
        messageDTO.setTimestamp(java.time.LocalDateTime.now());


        userService.saveMessage(messageDTO);


        WebSocketSession recipientSession = sessions.get(messageDTO.getRecipientEmail());
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.sendMessage(new TextMessage(payload));
        }


        if (session.isOpen()) {
            session.sendMessage(new TextMessage(payload));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
    }
}
