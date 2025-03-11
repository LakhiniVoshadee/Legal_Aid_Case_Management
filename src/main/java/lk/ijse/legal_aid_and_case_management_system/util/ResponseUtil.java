package lk.ijse.legal_aid_and_case_management_system.util;

public class ResponseUtil {
    private int code;
    private String msg;
    private Object data; //most super type eka object nisa object type eken gan

    public ResponseUtil() {
    }

    public ResponseUtil(int code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
