import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { HealthStatus, OutreachRequest, OutreachResponse, RecommendRequest, RecommendResponse } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * Returns top influencer matches based on product and target audience
 * @summary Get influencer recommendations
 */
export declare const getRecommendInfluencersUrl: () => string;
export declare const recommendInfluencers: (recommendRequest: RecommendRequest, options?: RequestInit) => Promise<RecommendResponse>;
export declare const getRecommendInfluencersMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recommendInfluencers>>, TError, {
        data: BodyType<RecommendRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof recommendInfluencers>>, TError, {
    data: BodyType<RecommendRequest>;
}, TContext>;
export type RecommendInfluencersMutationResult = NonNullable<Awaited<ReturnType<typeof recommendInfluencers>>>;
export type RecommendInfluencersMutationBody = BodyType<RecommendRequest>;
export type RecommendInfluencersMutationError = ErrorType<unknown>;
/**
 * @summary Get influencer recommendations
 */
export declare const useRecommendInfluencers: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recommendInfluencers>>, TError, {
        data: BodyType<RecommendRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof recommendInfluencers>>, TError, {
    data: BodyType<RecommendRequest>;
}, TContext>;
/**
 * Generates a personalized outreach message for a specific influencer
 * @summary Generate outreach message
 */
export declare const getGenerateOutreachUrl: () => string;
export declare const generateOutreach: (outreachRequest: OutreachRequest, options?: RequestInit) => Promise<OutreachResponse>;
export declare const getGenerateOutreachMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateOutreach>>, TError, {
        data: BodyType<OutreachRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof generateOutreach>>, TError, {
    data: BodyType<OutreachRequest>;
}, TContext>;
export type GenerateOutreachMutationResult = NonNullable<Awaited<ReturnType<typeof generateOutreach>>>;
export type GenerateOutreachMutationBody = BodyType<OutreachRequest>;
export type GenerateOutreachMutationError = ErrorType<unknown>;
/**
 * @summary Generate outreach message
 */
export declare const useGenerateOutreach: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateOutreach>>, TError, {
        data: BodyType<OutreachRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof generateOutreach>>, TError, {
    data: BodyType<OutreachRequest>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map