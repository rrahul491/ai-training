# Course design catalogue

This directory contains the reusable learning-design blueprints for courses in the prototype catalogue. A blueprint is content-first: it defines the learner outcome, module sequence, interaction pattern, visual direction, knowledge checks, assessment rules, and accessibility requirements before implementation begins.

## Courses designed

| Course                                            | Audience      | Estimated duration | Status                |
| ------------------------------------------------- | ------------- | -----------------: | --------------------- |
| AI at Work: Foundations, Safe Use and What's Next | All employees |         39 minutes | Implemented prototype |
| Recognising Phishing                              | All employees |         18 minutes | Design ready          |
| Data Handling Essentials                          | All employees |         22 minutes | Design ready          |

## Shared learner pattern

1. Welcome and objectives.
2. Six modules with four focused sections each.
3. One knowledge check after every module.
4. One final assessment with an explicit pass threshold.
5. Resume-friendly progress tracking and accessible narration.
6. One focused section at a time, with a complementary visual in an alternating side or wide-bottom layout.

## Implementation rules

- Learner-facing copy belongs in locale JSON, using uppercase enum-style keys.
- Course content and temporary records live outside UI components.
- Media is mapped by module and section; every visual has useful alt text or an empty alt when purely decorative.
- A keyboard user can complete every required interaction; no completion rule may rely on hover, drag, colour, audio, or animation alone.
- Keep layout, configuration, types, helpers, and hooks in their established project folders.
