package com.caplatform.domain.identity.repository;

import com.caplatform.domain.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * User Repository Interface
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findAllByIsActiveTrue();
    List<User> findByOfficeId(String officeId);
    List<User> findByDepartmentId(String departmentId);
}
