import React, { CSSProperties } from "react";
import { BreakpointConstraint } from "./Breakpoints";
/**
 * A render prop that can be used to render a different container element than
 * the default `div`.
 *
 * @see {@link MediaProps.children}.
 */
export type RenderProp = (className: string, renderChildren: boolean) => React.ReactNode;
export interface MediaBreakpointProps<BreakpointKey = string> {
    /**
     * Children will only be shown if the viewport matches the specified
     * breakpoint. That is, a viewport width that’s higher than the configured
     * breakpoint value, but lower than the value of the next breakpoint, if any
     * larger breakpoints exist at all.
     *
     * @example
  
       ```tsx
       // With breakpoints defined like these
       { xs: 0, sm: 768, md: 1024 }
  
       // Matches a viewport that has a width between 0 and 768
       <Media at="xs">ohai</Media>
  
       // Matches a viewport that has a width between 768 and 1024
       <Media at="sm">ohai</Media>
  
       // Matches a viewport that has a width over 1024
       <Media at="md">ohai</Media>
       ```
     *
     */
    at?: BreakpointKey;
    /**
     * Children will only be shown if the viewport is smaller than the specified
     * breakpoint.
     *
     * @example
  
       ```tsx
       // With breakpoints defined like these
       { xs: 0, sm: 768, md: 1024 }
  
      // Matches a viewport that has a width from 0 to 767
       <Media lessThan="sm">ohai</Media>
  
       // Matches a viewport that has a width from 0 to 1023
       <Media lessThan="md">ohai</Media>
       ```
     *
     */
    lessThan?: BreakpointKey;
    /**
     * Children will only be shown if the viewport is greater than the specified
     * breakpoint.
     *
     * @example
  
       ```tsx
       // With breakpoints defined like these
       { xs: 0, sm: 768, md: 1024 }
  
       // Matches a viewport that has a width from 768 to infinity
       <Media greaterThan="xs">ohai</Media>
  
       // Matches a viewport that has a width from 1024 to infinity
       <Media greaterThan="sm">ohai</Media>
       ```
     *
     */
    greaterThan?: BreakpointKey;
    /**
     * Children will only be shown if the viewport is greater or equal to the
     * specified breakpoint.
     *
     * @example
  
       ```tsx
       // With breakpoints defined like these
       { xs: 0, sm: 768, md: 1024 }
  
       // Matches a viewport that has a width from 0 to infinity
       <Media greaterThanOrEqual="xs">ohai</Media>
  
       // Matches a viewport that has a width from 768 to infinity
       <Media greaterThanOrEqual="sm">ohai</Media>
  
       // Matches a viewport that has a width from 1024 to infinity
       <Media greaterThanOrEqual="md">ohai</Media>
       ```
     *
     */
    greaterThanOrEqual?: BreakpointKey;
    /**
     * Children will only be shown if the viewport is between the specified
     * breakpoints. That is, a viewport width that’s higher than or equal to the
     * small breakpoint value, but lower than the value of the large breakpoint.
     *
     * @example
  
       ```tsx
       // With breakpoints defined like these
       { xs: 0, sm: 768, md: 1024 }
  
       // Matches a viewport that has a width from 0 to 767
       <Media between={["xs", "sm"]}>ohai</Media>
  
       // Matches a viewport that has a width from 0 to 1023
       <Media between={["xs", "md"]}>ohai</Media>
       ```
     *
     */
    between?: [BreakpointKey, BreakpointKey];
}
export interface MediaProps<BreakpointKey, Interaction> extends MediaBreakpointProps<BreakpointKey> {
    /**
     * Children will only be shown if the interaction query matches.
     *
     * @example
  
       ```tsx
       // With interactions defined like these
       { hover: "(hover: hover)" }
  
       // Matches an input device that is capable of hovering
       <Media interaction="hover">ohai</Media>
       ```
     */
    interaction?: Interaction;
    /**
     * The component(s) that should conditionally be shown, depending on the media
     * query matching.
     *
     * In case a different element is preferred, a render prop can be provided
     * that receives the class-name it should use to have the media query styling
     * applied.
     *
     * Additionally, the render prop receives a boolean that indicates wether or
     * not its children should be rendered, which will be `false` if the media
     * query is not included in the `onlyMatch` list. Use this flag if your
     * component’s children may be expensive to render and you want to avoid any
     * unnecessary work.
     * (@see {@link MediaContextProviderProps.onlyMatch} for details)
     *
     * @example
     *
       ```tsx
       const Component = () => (
         <Media greaterThan="xs">
           {(className, renderChildren) => (
             <span className={className}>
               {renderChildren && "ohai"}
             </span>
           )}
         </Media>
       )
       ```
     *
     */
    children: React.ReactNode | RenderProp;
    /**
     * Additional classNames to passed down and applied to Media container
     */
    className?: string;
    /**
     * Additional styles to passed down and applied to Media container
     */
    style?: CSSProperties;
}
export interface MediaContextProviderProps<M> {
    /**
     * This list of breakpoints and interactions can be used to limit the rendered
     * output to these.
     *
     * For instance, when a server knows for some user-agents that certain
     * breakpoints will never apply, omitting them altogether will lower the
     * rendered byte size.
     */
    onlyMatch?: M[];
    /**
     * Disables usage of browser MediaQuery API to only render at the current
     * breakpoint.
     *
     * Use this with caution, as disabling this means React components for all
     * breakpoints will be mounted client-side and all associated life-cycle hooks
     * will be triggered, which could lead to unintended side-effects.
     */
    disableDynamicMediaQueries?: boolean;
}
export interface CreateMediaConfig {
    /**
     * The breakpoint definitions for your application. Width definitions should
     * start at 0.
     *
     * @see {@link createMedia}
     */
    breakpoints: {
        [key: string]: number | string;
    };
    /**
     * The interaction definitions for your application.
     */
    interactions?: {
        [key: string]: string;
    };
}
export interface CreateMediaResults<BreakpointKey, Interactions> {
    /**
     * The React component that you use throughout your application.
     *
     * @see {@link MediaBreakpointProps}
     */
    Media: React.ComponentType<MediaProps<BreakpointKey, Interactions>>;
    /**
     * The React Context provider component that you use to constrain rendering of
     * breakpoints to a set list and to enable client-side dynamic constraining.
     *
     * @see {@link MediaContextProviderProps}
     */
    MediaContextProvider: React.ComponentType<MediaContextProviderProps<BreakpointKey | Interactions> & {
        children: React.ReactNode;
    }>;
    /**
     * Generates a set of CSS rules that you should include in your application’s
     * styling to enable the hiding behaviour of your `Media` component uses.
     */
    createMediaStyle(breakpointKeys?: BreakpointConstraint[]): string;
    /**
     * A list of your application’s breakpoints sorted from small to large.
     */
    SortedBreakpoints: BreakpointKey[];
    /**
     * Creates a list of your application’s breakpoints that support the given
     * widths and everything in between.
     */
    findBreakpointsForWidths(fromWidth: number, throughWidth: number): BreakpointKey[] | undefined;
    /**
     * Finds the breakpoint that matches the given width.
     */
    findBreakpointAtWidth(width: number): BreakpointKey | undefined;
    /**
     * Maps a list of values for various breakpoints to props that can be used
     * with the `Media` component.
     *
     * The values map to corresponding indices in the sorted breakpoints array. If
     * less values are specified than the number of breakpoints your application
     * has, the last value will be applied to all subsequent breakpoints.
     */
    valuesWithBreakpointProps<SizeValue>(values: SizeValue[]): [SizeValue, MediaBreakpointProps<BreakpointKey>][];
}
/**
 * This is used to generate a Media component, its context provider, and CSS
 * rules based on your application’s breakpoints and interactions.
 *
 * Note that the interaction queries are entirely up to you to define and they
 * should be written in such a way that they match when you want the element to
 * be hidden.
 *
 * @example
 *
   ```tsx
   const MyAppMedia = createMedia({
     breakpoints: {
       xs: 0,
       sm: 768,
       md: 900
       lg: 1024,
       xl: 1192,
     },
     interactions: {
       hover: `not all and (hover:hover)`
     },
   })

   export const Media = MyAppMedia.Media
   export const MediaContextProvider = MyAppMedia.MediaContextProvider
   export const createMediaStyle = MyAppMedia.createMediaStyle
   ```
 *
 */
export declare function createMedia<MediaConfig extends CreateMediaConfig, BreakpointKey extends keyof MediaConfig["breakpoints"], Interaction extends keyof MediaConfig["interactions"]>(config: MediaConfig): CreateMediaResults<BreakpointKey, Interaction>;
