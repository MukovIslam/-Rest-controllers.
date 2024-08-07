package ru.kata.spring.boot_security.demo.exception;

public class IncorrectData {
    private String info;


    public IncorrectData(String info) {
        this.info = info;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
