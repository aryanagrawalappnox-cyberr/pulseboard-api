export function formatValidationErrors(issues) {
    return issues.map(issue => {
        return {
            field: issue.path[0],
            message: issue.message
        };
    });
}