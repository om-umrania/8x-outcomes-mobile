# 8x Worker — Product Requirements (living doc)

## Original problem statement
Premium, calm, consumer-facing React Native (Expo, iOS-first) app for **8x**: workers complete short missions and build an **observed Capability Profile** based on *how* they work, not a résumé. Flow: receive mission → understand → consent (if recording) → complete via text or voice → submit → see evolving profile. Apple-like restraint + Liquid Glass depth + warm 8x branding. No enterprise/scoring/rubric terminology in the consumer UI. Primary demo: **Eat Eat hiring a South Indian chef** (voice mission "South Indian Chef Simulation").

## User choices
- Brand: custom premium terracotta palette (no BRAND.md existed) + system SF fonts.
- Voice: real mic recording with explicit consent (expo-audio), mocked agent states; web simulates capture.
- Backend: real FastAPI serving mocked missions + capability profile.
- Appearance: light & dark.
- Sign-in: none — lightweight name-only greeting.

## Architecture
- **Frontend**: Expo Router (file-based), React Native + TS, react-native-reanimated, expo-blur (Liquid Glass), expo-audio (recording), @gorhom/bottom-sheet (consent), react-native-keyboard-controller (forms), expo-image/linear-gradient, custom glass bottom tab bar.
- **Backend**: FastAPI, `/api` prefix, Motor/MongoDB. Mock data isolated in `mock_data.py`; profile stored in `profile_state` and "evolves" on each submission (process grows faster than outcome, process stays larger). Submissions stored in `submissions`.
- **Theme**: `src/theme` tokens (terracotta accent, warm neutrals) with light/dark.

## User personas
- **Candidate/worker** completing missions on their phone (primary).

## Core requirements (static)
- Mission Inbox with scannable cards + "Extra mission" treatment.
- Text mission (context first + structured questions + Submit).
- Voice mission: consent → immersive call UI (state, persistent RECORDING indicator, waveform, timer, controls).
- Submission Success ("Got it — thank you.").
- Capability Profile: ~5 horizontal bars split into Process (larger) vs Outcome; no gamification.
- History (secondary).
- Bottom tabs: Missions · Profile · History. Privacy: consent → visible → revocable.

## Implemented (2026-06)
- ✅ Welcome name entry; name-personalized greeting.
- ✅ Mission Inbox (3 missions incl. EXTRA badge), pull-to-refresh, loading/empty/error states.
- ✅ Mission Detail — Text (form + sticky submit, keyboard-aware).
- ✅ Mission Detail — Voice intro (hero, situation, scenario) + Consent bottom sheet (toggle).
- ✅ Voice call screen: expo-audio recording w/ full permission handling (granted/denied/blocked→Settings), mocked agent state machine, animated waveform, timer, pause/finish; web-simulated capture.
- ✅ Submission Success + auto-advance to Profile.
- ✅ Capability Profile with Process/Outcome split bars + observed-missions count (evolves after submissions).
- ✅ History list.
- ✅ Glass sticky headers + floating glass tab bar; light/dark; haptics; accessibility labels + testIDs.
- ✅ Backend endpoints: GET /missions, /missions/{id}, /profile, /history; POST /submissions. Tested 11/11 + full frontend E2E (no bugs).

## Backlog (prioritized)
- **P1** ElevenLabs real voice-agent call integration (needs API key from user).
- **P1** Persist per-mission completion so completed missions move to History and inbox updates.
- **P2** Onboarding polish: skip button, avatar image picker for profile.
- **P2** Reduce-motion audit for waveform; VoiceOver pass on voice screen.
- **P2** Migrate away from deprecated `props.pointerEvents` warning source when upstream lib updates.

## Next tasks
- Await user direction: ElevenLabs voice integration vs. profile/history persistence vs. visual polish.
