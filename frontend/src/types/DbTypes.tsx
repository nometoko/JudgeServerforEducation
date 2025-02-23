export interface ProblemProps {
    problem_id: string;
    is_petit_coder: boolean;
    name: string;
    open_date: string;
    close_date: string;
}

export interface ProblemWithStatus {
    problem: ProblemProps;
    status: boolean;
}

export interface TestcaseWithPath {
    TestcaseId: number,
    ArgsFilePath: string,
    StdinFilePath: string,
    InputFilePathList: string[],
    OutputFileName: string,
    AnswerFilePath: string,
}

export interface ProblemWithTestcase {
    Id: number,
    Name: string,
    Statement: string,
    Constraints: string,
    ExecutionTime: number,
    MemoryLimit: number,
    InputFmt: string,
    OutputFmt: string,
    OpenDate: string,
    CloseDate: string,
    BorderScore: number,
    Testcases: TestCaseProps[],
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
