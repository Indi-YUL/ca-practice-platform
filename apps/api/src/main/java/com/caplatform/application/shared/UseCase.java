package com.caplatform.application.shared;

/**
 * Base Use Case interface
 */
public interface UseCase<TRequest, TResponse> {
    TResponse execute(TRequest request);
}
