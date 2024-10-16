package codeartist99.taskflower.event.payload;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveEventRequest {
    @NotNull(message = "Title cannot be null.")
    private String title;
    private Long tagId;
    @NotNull(message = "Must not be null. use an empty list if applicable.")
    private List<Long> hashtagIds = new ArrayList<>();
    private String description;
    private String startDateTime;
    private String dueDateTime;
    private String location;
}
