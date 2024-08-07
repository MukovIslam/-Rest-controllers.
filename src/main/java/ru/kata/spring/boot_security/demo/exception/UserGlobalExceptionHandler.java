package ru.kata.spring.boot_security.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.model.User;

@ControllerAdvice
public class UserGlobalExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<IncorrectData> handlerException(NoSuchUserException e){
        IncorrectData data = new IncorrectData(e.getMessage());
        return  new ResponseEntity<>(data, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler
    public ResponseEntity<IncorrectData> handlerException(Exception e){
        IncorrectData data = new IncorrectData(e.getMessage());
        return  new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
    }

}
