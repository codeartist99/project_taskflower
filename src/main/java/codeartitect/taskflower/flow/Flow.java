package codeartitect.taskflower.flow;

import codeartitect.taskflower.flow.payload.SaveFlowRequest;
import codeartitect.taskflower.common.BaseTimeEntity;
import codeartitect.taskflower.hashtag.Hashtag;
import codeartitect.taskflower.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZoneId;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "Flow")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flow extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flow_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "title")
    private String title;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Hashtag> hashtags = new HashSet<>();

    @Column(name = "description")
    private String description;

    public Flow(User user, SaveFlowRequest saveFlowRequest) {
        this.user = user;
        this.title = saveFlowRequest.getTitle();
        setHashtags(saveFlowRequest.getHashtags());
        this.description = saveFlowRequest.getDescription();
    }

    private void setHashtags(Set<Hashtag> hashtags) {
        if (hashtags == null || hashtags.isEmpty()) {
            this.hashtags = new HashSet<>();
        }
    }

    @Override
    public ZoneId getUserZoneId() {
        return ZoneId.of(this.user.getZoneId());
    }

    public void update(SaveFlowRequest saveFlowRequest) {
        this.title = saveFlowRequest.getTitle();
        setHashtags(saveFlowRequest.getHashtags());
        this.description = saveFlowRequest.getDescription();
    }
}
