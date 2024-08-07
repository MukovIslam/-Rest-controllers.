package ru.kata.spring.boot_security.demo.controllers;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.securityService.UserSecurityService;
import ru.kata.spring.boot_security.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/")
public class UserController {


    private final IUserService userService;
    private final IDaoRoleService iDaoRoleService;

    @Autowired
    public UserController(IUserService userService, UserSecurityService securityService, IDaoRoleService iDaoRoleService) {
        this.userService = userService;
        this.iDaoRoleService = iDaoRoleService;
    }
    @GetMapping("/ap")
    public String index2(Model model, Principal principal) {
        User user1 = new User();
        model.addAttribute("currentUser", userService.findByUsername(principal.getName()));
        model.addAttribute("AllPeople", userService.getAllUsers());
        model.addAttribute("person", user1);
        model.addAttribute("allRoles", (iDaoRoleService.getAllRole()));
        return "/user";
    }
}
