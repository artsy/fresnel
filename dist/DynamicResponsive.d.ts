/**
 * TODO: This is the deprecated runtime media-query component from Reaction.
 *       It can probably be simplified somewhat if we’re not going to be using
 *       it directly any longer.
 */
import React from "react";
/** TODO */
export type MediaQueries<M extends string = string> = {
    [K in M]: string;
};
/** TODO */
export interface MediaQueryMatchers {
    [key: string]: MediaQueryList;
}
/** TODO */
export type MediaQueryMatches<M extends string = string> = {
    [K in M]: boolean;
};
/** TODO */
export interface ResponsiveProviderProps<M extends string> {
    mediaQueries: MediaQueries<M>;
    initialMatchingMediaQueries?: M[];
    children: React.ReactNode;
}
/** TODO */
export interface ResponsiveProviderState {
    mediaQueryMatchers?: MediaQueryMatchers;
    mediaQueryMatches: MediaQueryMatches;
}
/** TODO */
export declare function createResponsiveComponents<M extends string>(): {
    Consumer: React.FunctionComponent<React.ConsumerProps<MediaQueryMatches<M>>>;
    Provider: {
        new (props: ResponsiveProviderProps<M>): {
            isSupportedEnvironment: () => boolean;
            /**
             * Create an array of media matchers that can validate each media query
             */
            setupMatchers: (mediaQueries: MediaQueries) => MediaQueryMatchers;
            /**
             * Uses the matchers to build a map of the states of each media query
             */
            checkMatchers: (mediaQueryMatchers: MediaQueryMatchers) => MediaQueryMatches;
            /**
             * The function that will be called any time a media query status changes
             */
            mediaQueryStatusChangedCallback: () => void;
            componentDidMount(): void;
            componentWillUnmount(): void;
            shouldComponentUpdate(nextProps: Readonly<ResponsiveProviderProps<M>>, nextState: Readonly<ResponsiveProviderState>): boolean;
            render(): JSX.Element;
            context: unknown;
            setState<K extends keyof ResponsiveProviderState>(state: ResponsiveProviderState | ((prevState: Readonly<ResponsiveProviderState>, props: Readonly<ResponsiveProviderProps<M>>) => ResponsiveProviderState | Pick<ResponsiveProviderState, K> | null) | Pick<ResponsiveProviderState, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<ResponsiveProviderProps<M>>;
            state: Readonly<ResponsiveProviderState>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<ResponsiveProviderProps<M>>, prevState: Readonly<ResponsiveProviderState>): any;
            componentDidUpdate?(prevProps: Readonly<ResponsiveProviderProps<M>>, prevState: Readonly<ResponsiveProviderState>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<ResponsiveProviderProps<M>>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<ResponsiveProviderProps<M>>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<ResponsiveProviderProps<M>>, nextState: Readonly<ResponsiveProviderState>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<ResponsiveProviderProps<M>>, nextState: Readonly<ResponsiveProviderState>, nextContext: any): void;
        };
        contextType?: React.Context<any> | undefined;
    };
};
