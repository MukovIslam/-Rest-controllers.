package ru.kata.spring.boot_security.demo.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Table(name = "users_mvc")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotEmpty(message = "Поле не должно быть пустым")
    @Size(min = 2, max = 30, message = "Имя может содержать от 2 до 30 символов")
    @Column(name = "username")
    private String username;

    @NotEmpty(message = "Поле не должно быть пустым")
    @Size(min = 2, max = 30, message = "Фамилия может содержать от 2 до 30 символов")
    @Column(name = "lastname")
    private String lastName;

    @NotEmpty(message = "Поле не должно быть пустым")
    @Column(name = "password")
    private String password;

    @Email(message = "Не корректный Email")
    @NotEmpty(message = "Поле не должно быть пустым")
    @Column(name = "email")
    private String email;

    @Column(name = "age")
    private int age;



    @ManyToMany
    @JoinTable(
            name = ("user_role"),
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    private List<Role> roles = new ArrayList<>();

    public User(String firstName, String lastName, String email, String password, int age) {
        this.username = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.age = age;
    }

    public User() {
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getName())).collect(Collectors.toList());
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public @NotEmpty(message = "Поле не должно быть пустым") @Size(min = 2, max = 30, message = "Фамилия может содержать от 2 до 30 символов") String getLastName() {
        return lastName;
    }

    public void setLastName(@NotEmpty(message = "Поле не должно быть пустым") @Size(min = 2, max = 30, message = "Фамилия может содержать от 2 до 30 символов") String lastName) {
        this.lastName = lastName;
    }

    @Override
    public @NotEmpty(message = "Поле не должно быть пустым") @Size(min = 2, max = 30, message = "Имя может содержать от 2 до 30 символов") String getUsername() {
        return username;
    }

    public void setUsername(@NotEmpty(message = "Поле не должно быть пустым") @Size(min = 2, max = 30, message = "Имя может содержать от 2 до 30 символов") String username) {
        this.username = username;
    }

    @Override
    public @NotEmpty(message = "Поле не должно быть пустым") String getPassword() {
        return password;
    }

    public void setPassword(@NotEmpty(message = "Поле не должно быть пустым") String password) {
        this.password = password;
    }

    public @Email(message = "Не корректный Email") @NotEmpty(message = "Поле не должно быть пустым") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Не корректный Email") @NotEmpty(message = "Поле не должно быть пустым") String email) {
        this.email = email;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id && age == user.age && Objects.equals(username, user.username) && Objects.equals(lastName, user.lastName) && Objects.equals(password, user.password) && Objects.equals(email, user.email) && Objects.equals(roles, user.roles);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, lastName, password, email, age, roles);
    }
}