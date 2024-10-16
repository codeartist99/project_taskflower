export interface EventResponse {
    id: number;
    title: string;
    tag: { id: number; title: string; color: string };
    hashtags: { id: number; name: string }[];
    description: string;
    startDateTime: string;
    dueDateTime: string;
    location: string;
}

export interface EventSummary {
    id: number;
    title: string;
    tagTitle: string;
    tagColor: string;
    startDateTime: string;
    dueDateTime: string;
}

export interface SaveEventRequest {
    title: string;
    tagId?: number;
    hashtagIds?: number[];
    description?: string;
    startDateTime?: string;
    dueDateTime?: string;
    location?: string;
}
