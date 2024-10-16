package codeartist99.taskflower.task;

import codeartist99.taskflower.event.Event;
import codeartist99.taskflower.event.EventNotFoundException;
import codeartist99.taskflower.event.EventRepository;
import codeartist99.taskflower.hashtag.Hashtag;
import codeartist99.taskflower.tag.model.Tag;
import codeartist99.taskflower.task.exception.TaskNotFoundException;
import codeartist99.taskflower.task.model.Status;
import codeartist99.taskflower.task.model.Task;
import codeartist99.taskflower.task.payload.SaveTaskRequest;
import codeartist99.taskflower.task.payload.TaskResponse;
import codeartist99.taskflower.task.repository.TaskRepository;
import codeartist99.taskflower.task.service.TaskService;
import codeartist99.taskflower.user.UserRepository;
import codeartist99.taskflower.user.UserService;
import codeartist99.taskflower.user.model.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    private User user;

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        StringBuilder tempUsername;
        do {
            tempUsername = new StringBuilder();
            Random random = new Random();
            char[] charsForRandom = "abcdefghijklmnopqrstuvwxyz0123456789".toCharArray();
            for (int i = 0; i < 10; i++) {
                tempUsername.append(charsForRandom[random.nextInt(36)]);
            }
        } while (userRepository.existsByUsername(tempUsername.toString()));
        String username = tempUsername.toString();
        String zoneId = "Asia/Seoul";
        user = User.builder()
                .username(username)
                .build();
        userRepository.save(user);
    }

    @AfterEach
    void end() {
        userService.deleteById(user.getId());
    }

    /**
     * Test for saving task
     * Flow, Event, Tag, Hashtag null
     */
    @Test
    @DisplayName("save task and get task test")
    void save() throws TaskNotFoundException {
//        Arrange
        String title = "test title";
        Event event = null;
        Tag tag = null;
        List<Hashtag> hashtags = Collections.emptyList();
        String description = "test description";
        SaveTaskRequest saveTaskRequest = new SaveTaskRequest(title, event, tag, hashtags, description, Status.TODO);

//        Act
        TaskResponse taskResponse = taskService.save(user, saveTaskRequest);

//        Assert
        assertEquals(taskResponse.toString(), taskService.getById(taskResponse.getId()).toString());
    }

    /**
     * Test for find all tasks by user
     */
    @Test
    @DisplayName("find all by user test")
    void findAll() {
//        Arrange
//        first task
        String title = "test title";
        Event event = null;
        Tag tag = null;
        List<Hashtag> hashtags = Collections.emptyList();
        String description = "test description";
        SaveTaskRequest saveTaskRequest = new SaveTaskRequest(title, event, tag, hashtags, description, Status.TODO);

//        second task
        String title2 = "test title2";
        Event event2 = null;
        Tag tag2 = null;
        List<Hashtag> hashTags2 = Collections.emptyList();
        String description2 = "test description2";
        SaveTaskRequest saveTaskRequest2 = new SaveTaskRequest(title2, event2, tag2, hashTags2, description2, Status.IN_PROGRESS);

//        save a first task
        TaskResponse taskResponse = taskService.save(user, saveTaskRequest);
//        save a second task
        TaskResponse taskResponse2 = taskService.save(user, saveTaskRequest2);

//        Act
//        find all tasks
        List<TaskResponse> taskResponseList = taskService.findAll(user);

//        Assert
//        find a first task
        TaskResponse actualTaskResponse = taskResponseList.get(0);
//        find a second task
        TaskResponse actualTaskResponse2 = taskResponseList.get(1);

        assertEquals(taskResponse.toString(), actualTaskResponse.toString());
        assertEquals(taskResponse2.toString(), actualTaskResponse2.toString());
    }

    /**
     * Test for get all tasks filtered by flow and event
     */
    @Test
    @DisplayName("find task filtered by flow or event")
    void findAllByEventId() throws EventNotFoundException {
        Event event = new Event(null, user, "event title", null, null, "event description", LocalDateTime.now(), LocalDateTime.now().plusDays(1), null);
        eventRepository.save(event);
        Task task = new Task(null, user, "task title", event, null, null, "task description", Status.TODO, null);
        taskRepository.save(task);

        List<TaskResponse> taskResponseList = taskService.findAllByEventId(user, event.getId());
        TaskResponse savedTask = taskResponseList.get(0);

        assertEquals(event.getId(), savedTask.getEvent().getId());
        assertEquals(task.getId(), savedTask.getId());
    }

    /**
     * Test for update a task
     */
    @Test
    @DisplayName("update a task")
    void updateTask() throws TaskNotFoundException {
//        Arrange
//        save a task
        String title = "test title";
        Event event = null;
        Tag tag = null;
        List<Hashtag> hashtags = Collections.emptyList();
        String description = "test description";
        SaveTaskRequest saveTaskRequest = new SaveTaskRequest(title, event, tag, hashtags, description, Status.TODO);

        TaskResponse taskResponse = taskService.save(user, saveTaskRequest);

//        update a task
        String updateTitle = "test title2";
        Event updateEvent = null;
        Tag updateTag = null;
        List<Hashtag> updateHashtags = Collections.emptyList();
        String updateDescription = "test description2";
        SaveTaskRequest updateTaskRequest = new SaveTaskRequest(updateTitle, updateEvent, updateTag, updateHashtags, updateDescription, Status.IN_PROGRESS);

//        Act
        TaskResponse updateTaskResponse = taskService.updateTask(taskResponse.getId(), updateTaskRequest);

//        Assert
        assertEquals(updateTaskResponse.toString(), taskService.getById(taskResponse.getId()).toString());
    }

    /**
     * Test for delete task
     */
    @Test
    @DisplayName("delete task")
    void deleteById() throws TaskNotFoundException {
//        Arrange
//        save a task
        String title = "test title";
        Event event = null;
        Tag tag = null;
        List<Hashtag> hashtags = null;
        String description = "test description";
        SaveTaskRequest saveTaskRequest = new SaveTaskRequest(title, event, tag, hashtags, description, Status.TODO);

        TaskResponse taskResponse = taskService.save(user, saveTaskRequest);
        Long taskId = taskResponse.getId();

//        Act
        taskService.deleteById(taskResponse.getId());

//        Assert
        assertThrows(TaskNotFoundException.class, () -> taskService.getById(taskId));
    }
}