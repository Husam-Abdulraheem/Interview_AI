import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore, DEMO_USERS } from './mockData';

describe('mockStore portfolio showcase logic', () => {
    beforeEach(() => {
        mockStore.resetAll();
    });

    it('should initialize and return default demo courses', () => {
        const courses = mockStore.getCourses();
        expect(courses.length).toBeGreaterThanOrEqual(5);
        expect(courses[0]).toHaveProperty('title');
        expect(courses[0].questions.length).toBeGreaterThan(0);
    });

    it('should simulate an interview attempt lifecycle', () => {
        const courses = mockStore.getCourses();
        const firstCourse = courses[0];

        // 1. Start Attempt
        const attempt = mockStore.startAttempt({ courseId: firstCourse.id });
        expect(attempt.id).toBeDefined();
        expect(attempt.courseId).toBe(firstCourse.id);

        // 2. Submit Answer
        const question = firstCourse.questions[0];
        mockStore.submitAnswer(attempt.id, {
            questionId: question.id,
            answer: 'This is a comprehensive response discussing architectural tradeoffs and scalability considerations in production environments.'
        });

        // 3. Complete Attempt
        const completed = mockStore.completeAttempt(attempt.id);
        expect(completed.completedAt).toBeDefined();
        expect(completed.totalScore).toBeGreaterThanOrEqual(60);
        expect(completed.questionAttempts.length).toBe(1);
        expect(completed.questionAttempts[0].score).toBeGreaterThan(0);
    });

    it('should manage creator approval in admin workflow', () => {
        const requests = mockStore.getRequests();
        expect(requests.length).toBeGreaterThan(0);
        const reqToApprove = requests[0];

        mockStore.approveRequest(reqToApprove.id);
        const remaining = mockStore.getRequests();
        expect(remaining.some(r => r.id === reqToApprove.id)).toBe(false);

        const users = mockStore.getUsers();
        expect(users.some(u => u.email === reqToApprove.email)).toBe(true);
    });

    it('should have predefined DEMO_USERS for all 3 roles', () => {
        expect(DEMO_USERS.admin.role).toBe(0);
        expect(DEMO_USERS.creator.role).toBe(2);
        expect(DEMO_USERS.trainee.role).toBe(3);
    });
});
