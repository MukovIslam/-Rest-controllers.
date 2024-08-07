package ru.kata.spring.boot_security.demo.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Repository
public class UserDao implements IUserDao {

    @PersistenceContext
    private EntityManager em;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserDao(@Lazy PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public List<User> getAllUsers() {

        return em.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    @Override
    public void addUser(User user) {
        System.out.println(user.getId());
        if (user.getId() == 0) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            em.persist(user);
        }
    }

    @Override
    public void deleteUser(int id) {
        User user = em.find(User.class, id);
        if (user != null) {
            em.remove(user);
        }
    }

    @Override
    public void updateUser(User user) {
        User user1 = em.find(User.class, user.getId());
        if (!user.getPassword().equals(user1.getPassword())) {
            System.out.println("было" + user.getPassword() + "стало" + user1.getPassword());
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        }
        em.merge(user);
    }

    @Override
    public void deleteAllUsers() {
        em.createQuery("DELETE FROM User").executeUpdate();
        em.createNativeQuery("ALTER TABLE test2.users_mvc AUTO_INCREMENT = 1").executeUpdate();

    }

    @Override
    public User getById(int id) {
        try {
            return em.createQuery("SELECT u FROM User u WHERE u.id = :userId", User.class)
                    .setParameter("userId", id)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;  // или выбросить свое собственное исключение, если это более подходящее решение
        }
    }

    @Override
    public User show(int id) {
        return getAllUsers().stream().filter(prson -> prson.getId() == id).findAny().orElse(null);
    }


}
