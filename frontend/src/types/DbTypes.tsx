export interface ProblemProps {
    problem_id: string;
    is_petit_coder: boolean;
    name: string;
    open_date: string;
    close_date: string;
    statement: string;
    constraints: string;
    input_format: string;
    output_format: string;
}

export interface ProblemWithStatus {
    problem: ProblemProps;
    status: boolean;
}

export interface TestCaseProps {
    testcase_number: number,
    args_file_content: string,
    stdin_file_content: string,
    input_file_contents: string[],
    answer_file_content: string,
}

export interface TestCaseUserResultProps {
    output_content: string,
    status: string,
}

export interface TestCaseResultProps {
    testcase: TestCaseProps;
    user_result: TestCaseUserResultProps;
}

export interface FileContent {
    filename: string,
    content: string,
}

export interface SubmissionProps {
    submission_id: string;
    user_name: string;
    problem_id: number;
    submitted_date: string;
    status: string;
    compile_error: string | null;
}
