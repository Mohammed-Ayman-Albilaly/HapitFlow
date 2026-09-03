# QA Test Matrix: HabitFlow

## 1. Authentication & Security
| Test Case | Scenario | Expected Result | Risk |
|:---|:---|:---|:---|
| AUTH-01 | Register with valid email/password | User created, JWT returned, redirected to dashboard. | High |
| AUTH-02 | Register with existing email | 400 Bad Request, "User already exists" message. | Medium |
| AUTH-03 | Login with correct credentials | 200 OK, JWT returned, session persisted. | High |
| AUTH-04 | Login with wrong password | 401 Unauthorized, "Invalid credentials" message. | High |
| AUTH-05 | Access protected route without token | 401 Unauthorized, redirected to login. | High |
| AUTH-06 | Data Isolation: Access another user's habit | 404 Not Found or 403 Forbidden. | Critical |

## 2. Habit & Category Management
| Test Case | Scenario | Expected Result | Risk |
|:---|:---|:---|:---|
| HAB-01 | Create habit with valid category | Habit created and appears in list. | High |
| HAB-02 | Create habit without category | 400 Bad Request, validation error. | Medium |
| HAB-03 | Create custom category | Category created and available for habits. | Medium |
| HAB-04 | Update habit details | Changes reflected immediately in UI. | Medium |
| HAB-05 | Delete habit | Habit and its completions removed from DB. | Medium |

## 3. Tracking & Streak Engine (Core Logic)
| Test Case | Scenario | Expected Result | Risk |
|:---|:---|:---|:---|
| STRK-01 | Mark Daily habit complete today | Completion record created, streak increments. | Critical |
| STRK-02 | Mark Daily habit complete twice | Idempotent: only one record, 400 error on 2nd try. | High |
| STRK-03 | Daily Streak: Miss one day | Streak resets to 0. | Critical |
| STRK-04 | Daily Streak: Consecutive days | Streak increments correctly (e.g., 3 days $\rightarrow$ 3). | Critical |
| STRK-05 | Weekly Streak: Complete once/week | Streak continues across calendar weeks. | High |
| STRK-06 | Weekly Streak: Miss a whole week | Streak resets to 0. | High |

## 4. Dashboard & Visualizations
| Test Case | Scenario | Expected Result | Risk |
|:---|:---|:---|:---|
| DASH-01 | Total Habits count | Matches number of habits in DB for user. | Medium |
| DASH-02 | Completed Today count | Matches completions for current date. | Medium |
| DASH-03 | Weekly Bar Chart | Correct counts for the last 7 days. | Medium |
| DASH-04 | Activity Heatmap | Correct density mapping for the last 365 days. | Medium |
| DASH-05 | Empty State | New user sees "Welcome" UI instead of empty lists. | Low |

## 5. Non-Functional & UI/UX
| Test Case | Scenario | Expected Result | Risk |
|:---|:---|:---|:---|
| UI-01 | Glassmorphism check | Backdrop-blur and semi-transparent borders visible. | Medium |
| UI-02 | Animation smoothness | Framer Motion transitions are fluid (no stutter). | Medium |
| UI-03 | Responsiveness | Layout adapts to Mobile, Tablet, and Desktop. | High |
| PERF-01 | API Latency | Dashboard and Habit endpoints respond < 300ms. | Medium |
