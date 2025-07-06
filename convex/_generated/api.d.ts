/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as CustomProfile from "../CustomProfile.js";
import type * as auth from "../auth.js";
import type * as history from "../history.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as promises from "../promises.js";
import type * as rewards from "../rewards.js";
import type * as roomUsers from "../roomUsers.js";
import type * as rooms from "../rooms.js";
import type * as sessions from "../sessions.js";
import type * as signals from "../signals.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  CustomProfile: typeof CustomProfile;
  auth: typeof auth;
  history: typeof history;
  http: typeof http;
  leaderboard: typeof leaderboard;
  promises: typeof promises;
  rewards: typeof rewards;
  roomUsers: typeof roomUsers;
  rooms: typeof rooms;
  sessions: typeof sessions;
  signals: typeof signals;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
