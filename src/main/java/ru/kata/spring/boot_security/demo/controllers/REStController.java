package ru.kata.spring.boot_security.demo.controllers;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import ru.kata.spring.boot_security.demo.exception.IncorrectData;
import ru.kata.spring.boot_security.demo.exception.NoSuchUserException;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.IDaoRoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class REStController {
    private final UserService userService;
    private final IDaoRoleService iDaoRoleService;

    @Autowired
    public REStController(UserService userService, IDaoRoleService iDaoRoleService) {
        this.userService = userService;
        this.iDaoRoleService = iDaoRoleService;
    }

    @PutMapping("/users1")
    public ResponseEntity<List<User>> showAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.CREATED);
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable int id) {
        User user = userService.getById(id);
        if (user == null) {
            throw new NoSuchUserException("there is no user with ID = " + id + " in Database");
        }
        return user;
    }

    @PostMapping("/user")
    public ResponseEntity<User> addNewUser(@RequestBody User user) {
        userService.addUser(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PutMapping("/users")
    public User apdateUser(@RequestBody User user) {
        System.out.println(user.getPassword());
        userService.updateUser(user);
        return user;
    }

    @DeleteMapping ("/user/{id}")
    public String deleteUser(@PathVariable int id) {
        if (userService.getById(id) == null) {
            throw new NoSuchUserException("No user found with such ID = " + id);
        }
        userService.deleteUser(id);
        return "User  with id = " + id + " was deleted";
    }

    @GetMapping("/user/roles")
    public List<Role> getUserRoles(Principal principal) {
        return userService.findByUsername(principal.getName()).getRoles();
    }

    @PutMapping("/rolesId")
    public List<Role> getUserRolesFindById(@RequestBody User user) {
        int id = user.getId();
        return userService.getById(id).getRoles();
    }

    @GetMapping("/user")
    public User getCurrentUser(Principal principal) {
        return userService.findByUsername(principal.getName());
    }
    @PutMapping("/roles")
    public List<Role> getAllRoles() {
        return iDaoRoleService.getAllRole();
    }

}


