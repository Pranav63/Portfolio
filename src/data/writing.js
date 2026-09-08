export const ARTICLES = [
  {
    slug: 'what-ten-rag-queries-can-tell-you',
    category: 'RAG evaluation',
    title: 'What ten RAG queries can and cannot tell you',
    summary: 'Reading a small evaluation without turning an average score into a claim of production readiness.',
    readTime: '3 min read',
    project: 'rag-eval',
    source: 'https://github.com/Pranav63/production-rag-eval',
    sections: [
      { title: 'Start with the question behind the score', paragraphs: [
        'My RAG project reports an average judge score of 3.6 out of 5 across ten queries. Six answers scored four or five. Those numbers describe a small run; they do not establish how the system performs across the questions a future user might ask.',
        'The useful question is what the run helps diagnose. The system searches a corpus of 73 research papers, reranks retrieved candidates, and logs the answer, latency, and judge score. Keeping those pieces together makes an answer something I can investigate rather than simply accept.',
      ] },
      { title: 'Separate missing evidence from a weak answer', paragraphs: [
        'The repository reports low scores for questions on topics underrepresented in the corpus. That points to a coverage problem worth inspecting. A low final score alone cannot tell me whether to add documents, change retrieval, adjust chunking, or revise generation.',
        'For the next evaluation, I would record whether the corpus contains an answer, whether retrieval finds it, and whether the final response uses it correctly. An answer can fail at any of those boundaries. A single aggregate score hides that distinction.',
      ] },
      { title: 'Make the result reproducible', paragraphs: [
        'The next useful artifact is a versioned set of per-query records: question, expected evidence, retrieved passages, response, judge reasoning, and latency. It should travel with the corpus version, judge rubric, and model settings. The current portfolio labels the aggregate numbers as repository-reported because the raw ten-query results are not yet committed.',
        'I would then expand the set with answerable, unanswerable, and ambiguous questions and add human review. The reported 950 ms average also needs a specified environment and a latency distribution before it becomes useful as an operating target.',
      ] },
      { title: 'The lesson', paragraphs: [
        'A small evaluation is valuable when it identifies the next experiment. For this project, the next step is a better evidence trail and broader coverage. The dashboard becomes more useful when a reader can move from a number to the exact run that produced it.',
      ] },
    ],
  },
  {
    slug: 'human-approval-is-a-product-feature',
    category: 'Agentic systems',
    title: 'Human approval is a product feature',
    summary: 'What a reviewer needs to see between a model-generated signal and an action.',
    readTime: '2 min read',
    project: 'trading-agent',
    source: 'https://github.com/Pranav63/trading-quant-ai-agent',
    sections: [
      { title: 'A signal is a proposal', paragraphs: [
        'The trading-agent prototype reads financial news, produces a signal, applies technical checks, and prepares a paper trade for review. The most important product boundary is between proposing the trade and approving it. Model output does not remove the need for that boundary.',
        'This is a paper-trading experiment, not evidence of investment returns. Its value as an engineering project is the opportunity to make each step visible and to design the transition from recommendation to action deliberately.',
      ] },
      { title: 'Make the review possible', paragraphs: [
        'An approval button is only useful if the person beside it can understand the proposal. The saved dashboard screenshots expose model reasoning, technical checks, confidence information, and the pending review state. The reviewer should not have to reconstruct the recommendation from several unrelated screens.',
        'I would evaluate that interface by asking someone to explain why a signal was proposed, which checks it passed, and what would happen if approved. If they cannot answer those questions from the interface, the system has moved the burden to the human without supporting the decision.',
      ] },
      { title: 'Controls need their own evidence', paragraphs: [
        'Risk limits and a kill switch express operating constraints. Their presence is not a performance result. The next evaluation should record when controls reject a proposal, why it was rejected, and whether repeated approval attempts can produce duplicate actions.',
        'A repeatable paper-trading report and backtests are still needed before assessing signal quality. I would include rejected and expired proposals in that report rather than only successful executions. Otherwise the record leaves out the decisions where the controls mattered most.',
      ] },
      { title: 'The lesson', paragraphs: [
        'Treat approval as an interface and a state transition that deserves design attention. A useful agent gives a person the context to disagree with it and leaves a record that makes the action understandable later.',
      ] },
    ],
  },
  {
    slug: 'measuring-code-switching-without-overclaiming',
    category: 'Multilingual fine-tuning',
    title: 'More English terms do not prove a better answer',
    summary: 'What changed in four Arabic-English model comparisons, and what the metric leaves unanswered.',
    readTime: '3 min read',
    project: 'qlora',
    source: 'https://github.com/Pranav63/qlora-multilingual-finetuning/blob/main/eval/benchmark.py',
    sections: [
      { title: 'Define the behavior first', paragraphs: [
        'The QLoRA experiment targets Arabic-English code-switching: Arabic sentences that retain English technical terms. The question is whether adapter training changes that register, not whether it makes the model better at every task.',
        'Four saved prompts cover supply chains, machine learning, data preparation, and overfitting. The case study lets you inspect both outputs for each prompt. Keeping the examples visible makes it possible to challenge the metric rather than relying on a chart alone.',
      ] },
      { title: 'What the benchmark actually counts', paragraphs: [
        'The benchmark splits each response on whitespace. It counts words containing two or more consecutive Latin letters and divides by the total word count. It then averages the ratios across the four prompts. By that rule, the reported average rises from 5.1% in the base model to 34.7% in the fine-tuned model.',
        'The interactive viewer uses the same rule to highlight terms and calculate each response percentage. This is a reproducible description of English-term usage. It is not a language-identification system, a measure of naturalness, or a test of factual accuracy.',
      ] },
      { title: 'Read the text beside the number', paragraphs: [
        'The saved fine-tuned responses use more English terminology, which is consistent with the intended register change. But more terminology can also make a sentence cumbersome. The samples include incomplete endings and content that still needs review. Those details remain visible in the viewer rather than being edited out.',
        'Four prompts cannot establish that the behavior generalizes to unfamiliar domains or that a Gulf professional would prefer the answer. A model can move the percentage in the desired direction while failing to follow an instruction or producing an inaccurate explanation.',
      ] },
      { title: 'The next evaluation', paragraphs: [
        'I would create a held-out set and ask reviewers to assess naturalness, correctness, instruction following, and completeness separately. Domain coverage and generation settings should be recorded alongside the responses. The code-switch ratio can remain one diagnostic signal, but it should not carry the whole quality claim.',
      ] },
    ],
  },
];
