package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private Integer age;
    private String degree;
    private String experience;
    private String email;
    private String resumePath;
    private String project;

    @Enumerated(EnumType.STRING)
    private Status status; // <-- added status field

    public enum Status {
        PENDING,
        ACCEPTED,
        DECLINED
    }

    // --- Constructors ---
    public Application() {}

    public Application(String firstName, String lastName, Integer age, String degree,
                       String experience, String email, String project) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.degree = degree;
        this.experience = experience;
        this.email = email;
        this.project = project;
        this.status = Status.PENDING;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
