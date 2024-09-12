package codeartist99.taskflower.event.payload;

import codeartist99.taskflower.event.Event;
import codeartist99.taskflower.hashtag.Hashtag;
import codeartist99.taskflower.tag.model.Tag;
import codeartist99.taskflower.common.util.TimeUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class EventResponse {
    private Long id;
    private String title;
    private Tag tag;
    private List<Hashtag> hashtags;
    private String description;
    private String startDateTime;
    private String dueDateTime;
    private String location;

    public EventResponse(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.tag = event.getTag();
        this.hashtags = event.getHashtags();
        this.description = event.getDescription();
        this.startDateTime = TimeUtil.localDateTimeToIsoString(event.getStartDateTime());
        this.dueDateTime = TimeUtil.localDateTimeToIsoString(event.getDueDateTime());
        this.location = event.getLocation();
    }
}
