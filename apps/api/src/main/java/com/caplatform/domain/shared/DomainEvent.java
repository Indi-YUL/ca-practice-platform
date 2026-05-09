package com.caplatform.domain.shared;

/**
 * Domain Event base class
 * Used for domain events that represent something that happened in the domain
 */
public abstract class DomainEvent {
    private final String aggregateId;
    private final long occurredAt;

    protected DomainEvent(String aggregateId) {
        this.aggregateId = aggregateId;
        this.occurredAt = System.currentTimeMillis();
    }

    public String getAggregateId() {
        return aggregateId;
    }

    public long getOccurredAt() {
        return occurredAt;
    }

    public abstract String getEventName();
}
