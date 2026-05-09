package com.caplatform.domain.shared;

/**
 * Base Value Object class
 * Immutable objects that are compared by value, not identity
 */
public abstract class ValueObject {
    
    public abstract boolean equals(Object obj);

    @Override
    public abstract int hashCode();
}
