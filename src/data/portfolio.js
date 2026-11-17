export const PROJECTS = [
  {
    id: 'ishara',
    title: 'Ishara: Interpreter Dispatch Agent',
    subtitle: 'Books a sign language interpreter from a forwarded appointment message, in English or Arabic',
    description:
      'A Deaf resident pastes an appointment SMS or email. The agent reads it, asks the resident to confirm the details, offers the slot to qualified interpreters in waves, keeps a backup ready, and finds a replacement automatically if the interpreter cancels.',
    metrics: ['English + Arabic Messages', 'Human Approval First', 'Live Demo'],
    caseStudy: {
      evidence: [
        { value: '2', label: 'interface languages, with right-to-left Arabic' },
        { value: '0', label: 'offers sent before the resident approves' },
        { value: '63', label: 'API regression tests' },
      ],
      decisions: [
        { title: 'Rules first, model second', rationale: 'A rules parser reads English and Arabic messages on its own. A hosted model only refines it, and any model failure falls back to the rules reading.' },
        { title: 'The resident approves before anyone is contacted', rationale: 'Parsed details are shown for correction, and fields the agent guessed are marked. No interpreter sees the request until the resident confirms.' },
        { title: 'Plan for cancellations', rationale: 'Each outcome updates an interpreter reliability score used by the next match, and a cancellation triggers an automatic replacement.' },
      ],
    },
    highlights: ['Arabic and English appointment messages, with identifiers redacted before parsing'],
    proofs: [
      { src: '/project-proofs/ishara-review.png', width: 1600, height: 1000, alt: 'Ishara review page showing an Arabic hospital appointment message parsed into location, area, date, visit type and sign language fields, with a Confirm request button', caption: 'An Arabic message read into reviewable details' },
      { src: '/project-proofs/ishara-status.png', width: 1600, height: 1000, alt: 'Ishara request status page showing the interpreter search in progress, the appointment details and a timeline of what the agent has done', caption: 'Matching in progress, with the agent timeline' },
    ],
    github: 'https://github.com/Pranav63/Ishara',
    live: 'https://ishara-tan.vercel.app',
  },
  {
    id: 'memory-lab',
    title: 'Research Memory Lab',
    subtitle: 'A research workspace that keeps cited evidence, reviewed findings and their history',
    description:
      'Import papers and notes, ask questions over them with citations, turn sources into study material, record a human verdict on each claim, and keep versioned findings in a graph memory. An experiment bench compares answers with no context, source retrieval, and retrieval plus memory.',
    metrics: ['Hybrid Retrieval', 'Graph Memory', '3-condition Experiments'],
    caseStudy: {
      evidence: [
        { value: '3', label: 'context conditions compared per question' },
        { value: '6 × 600', label: 'snippet budget, same for both retrieval conditions' },
        { value: 'Local or hosted', label: 'generation, same evidence' },
      ],
      decisions: [
        { title: 'Combine keyword and meaning search', rationale: 'SQLite FTS5 and local embeddings are ranked separately and merged with reciprocal rank fusion.' },
        { title: 'A person decides what is remembered', rationale: 'Only a claim whose latest human verdict is "supported" can become a finding, and revised findings keep their earlier versions.' },
        { title: 'Make the comparison fair', rationale: 'Both retrieval conditions get the same snippet budget, and exports keep context, prompt and model hashes so a run can be inspected later.' },
      ],
    },
    highlights: ['Citations are checked against the passages actually given to the model'],
    proofs: [
      { src: '/project-proofs/memory-lab-experiments.png', width: 1440, height: 1034, alt: 'Research Memory Lab experiments page comparing no context, source retrieval, and sources plus memory for one research question', caption: 'Experiment bench: three kinds of context' },
      { src: '/project-proofs/memory-lab-studio.png', width: 1440, height: 1099, alt: 'Research Memory Lab studio page for turning selected sources into a cited research report', caption: 'Studio: cited outputs from chosen sources' },
    ],
    github: 'https://github.com/Pranav63/memory-lab',
  },
  {
    id: 'mizan',
    title: 'Mizan: Arabic-English Policy Benchmark',
    subtitle: 'Tests whether a policy clause keeps its meaning across English, Arabic and mixed text',
    description:
      'A benchmark that classifies policy clauses as obligations, prohibitions, permissions, definitions or procedures, in English, Modern Standard Arabic and mixed-language versions of the same clause. It compares a local 4B model scored by direct option logits with a hosted GPT baseline.',
    metrics: ['60 / 60 Both Models', '307ms vs 1,207ms Median', '$0.04 Full GPT Run'],
    caseStudy: {
      evidence: [
        { value: '60 / 60', label: 'correct for both models on the starter set' },
        { value: '307ms', label: 'local median latency (GPT: 1,207ms)' },
        { value: '$0.04', label: 'estimated GPT cost for all 60 clauses' },
      ],
      decisions: [
        { title: 'Test meaning, not translation', rationale: 'Each clause comes as an English, Arabic and mixed triplet, so the benchmark can check that all three receive the same label.' },
        { title: 'Score the local model without generation', rationale: 'The local model picks a label from option logits with zero generated tokens, so there is no free text to parse.' },
        { title: 'Cap spend before a run starts', rationale: 'A conservative cost estimate is checked against a per-run ceiling before any hosted call is made.' },
      ],
    },
    highlights: ['Both models scored 100% on a synthetic starter set: the next step is a harder, reviewed one'],
    proofs: [
      { src: '/project-proofs/mizan-live-run.png', width: 1440, height: 1100, alt: 'Mizan overview showing a live benchmark run with per-language accuracy for the local model and GPT, agreement across languages and median response time', caption: 'A live run: per-language accuracy for both models' },
    ],
    github: 'https://github.com/Pranav63/mizan',
  },
  {
    id: 'trading-agent',
    title: 'Risk-Controlled AI Trading Agent',
    subtitle: 'Turns financial news into paper-trading decisions with human approval',
    description:
      'Reads financial news, confirms the signal with technical indicators, and prepares a paper trade for human approval. Every decision is logged for review.',
    metrics: ['15-min News Cycle', '55% Confidence Gate', 'Paper Trading Only'],
    caseStudy: {
      evidence: [
        { value: '15 min', label: 'news cycle' },
        { value: '5 min', label: 'position checks' },
        { value: '10%', label: 'single-trade cap' },
      ],
      decisions: [
        { title: 'Keep a person in control', rationale: 'A person must approve every trade before it reaches the paper account.' },
        { title: 'Do not trust news alone', rationale: 'Signals must also clear technical checks, reaching 55% combined confidence.' },
        { title: 'Limit damage before chasing returns', rationale: 'Trades are capped at 10% of equity, exposure at 50%, with a $400 kill switch.' },
      ],
    },
    highlights: ['News is collected every 15 minutes and queued in Redis'],
    proofs: [
      { src: '/project-proofs/trading-dashboard.png', width: 1600, height: 1000, alt: 'Local paper-trading dashboard showing live signals, pending approvals, news activity and system health with account amounts hidden', caption: 'Local system run: paper-account amounts hidden'},
      { src: '/project-proofs/trading-signals.png', width: 1600, height: 1000, alt: 'Expanded trading signal showing model reasoning, technical indicator checks, confidence breakdown and a pending manual review', caption: 'Signal reasoning and technical checks' },
    ],
    github: 'https://github.com/Pranav63/trading-quant-ai-agent',
  },
  {
    id: 'rag-eval',
    title: 'Production RAG Evaluation System',
    subtitle: 'Answers questions from research papers and measures answer quality',
    description:
      'A question-answering system over 73 AI research papers: hybrid search, reranking, and a dashboard that tracks answer quality and speed.',
    metrics: ['3.6 / 5 Judge Score', '~950ms Avg Query', '10-query Evaluation'],
    caseStudy: {
      evidence: [
        { value: '3.6 / 5', label: 'average judge score' },
        { value: '60%', label: 'queries scoring 4-5' },
        { value: '~950ms', label: 'average query time' },
      ],
      decisions: [
        { title: 'Search by keywords and meaning', rationale: 'Keyword search catches exact technical terms while embeddings find passages with similar meaning.' },
        { title: 'Rerank before answering', rationale: 'Retrieves 20 candidates, then a second model chooses the best three for the final answer.' },
        { title: 'Show quality over time', rationale: 'Every query, response time and judge score is logged, surfacing weak answers and corpus gaps.' },
      ],
    },
    highlights: ['10-query evaluation reported in the repository'],
    proofs: [
      { src: '/project-proofs/rag-query.png', width: 3280, height: 1700, alt: 'RAG system query page showing a generated answer and retrieved research papers', caption: 'Query and retrieved evidence' },
      { src: '/project-proofs/rag-evaluation.png', width: 3348, height: 1688, alt: 'RAG evaluation dashboard showing answer quality and latency metrics', caption: 'Evaluation and latency dashboard' },
    ],
    github: 'https://github.com/Pranav63/production-rag-eval',
  },
  {
    id: 'qlora',
    title: 'Arabic-English QLoRA Fine-tuning',
    subtitle: 'Teaches a compact model how Gulf professionals naturally mix Arabic and English',
    description:
      'A fine-tuning pipeline for Qwen2.5-3B that learns the Arabic-English code-switching used in Gulf workplaces: dataset prep, lightweight adapter training tracked in MLflow, and a base-versus-tuned comparison on the same prompts.',
    metrics: ['34.7% Code-switch Ratio', '+584% vs Base', '653 Clean Samples'],
    caseStudy: {
      evidence: [
        { value: '34.7%', label: 'fine-tuned ratio' },
        { value: '5.1%', label: 'base-model ratio' },
        { value: '653', label: 'clean examples' },
      ],
      decisions: [
        { title: 'Use Qwen2.5 as the base model', rationale: 'Its stronger Arabic foundation needs less task-specific data to learn the target style.' },
        { title: 'Train small adapters', rationale: 'QLoRA updates roughly 1% of the model parameters, making training practical on local hardware.' },
        { title: 'Compare the same prompts', rationale: 'Four stored base-versus-fine-tuned outputs make the claimed behaviour change easy to inspect.' },
      ],
    },
    highlights: ['Code-switch ratio rose from 5.1% to 34.7% across four stored prompts'],
    proofs: [
      { src: '/project-proofs/qlora-benchmark.png', width: 2086, height: 925, alt: 'Chart comparing Arabic-English code-switch ratios for the base and fine-tuned Qwen models', caption: 'Base model versus fine-tuned comparison' },
    ],
    github: 'https://github.com/Pranav63/qlora-multilingual-finetuning',
  },
];

export const EXPERIENCE = [
  {
    title: 'Applied AI Scientist',
    company: 'Inception42 · a G42 company',
    period: 'Jul 2026 - Present',
    location: 'Abu Dhabi, UAE',
    achievements: [
      'Machine-Readable Government: turning uploaded government policy into machine-readable artifacts that drive evidence-backed, reviewable case workflows',
      'Bilingual PDF-to-markdown and policy-graph processing with governed extraction review, versioned provenance and controlled publication',
      'Eval Workbench: approved ground-truth suites, repeated-run stability measurement and exact-version release gates before anything ships',
      'Agentic case processing on FastAPI, PostgreSQL and AKS, with row-level security and immutable run fencing',
    ],
    tags: ['Applied AI', 'Agentic Systems', 'Evaluation', 'Governance', 'Azure / AKS'],
  },
  {
    title: 'Senior ML Engineer',
    company: 'Hewlett Packard Enterprise',
    period: 'Aug 2024 - Jul 2026',
    location: 'Singapore',
    achievements: [
      'Text-to-SQL platform: 85% accuracy, 2,000+ queries/week across 7 business units',
      'K8s Watcher agentic system: 70% MTTR reduction, 50+ incidents/week',
      'Document Planning Hub: LangGraph multi-agent, 5,000+ users, 80% error reduction',
      'OneAI platform standards across 8 teams: deployment failures down 60%',
    ],
    tags: ['LangGraph', 'GPT-4o', 'Azure OpenAI', 'Kubernetes', 'FastAPI'],
  },
  {
    title: 'Data Scientist',
    company: 'Micron Technology',
    period: 'Jan 2022 - Aug 2024',
    location: 'Singapore',
    achievements: [
      'PPO RL wafer scheduling: $10M annual revenue impact, 0.5% production increase',
      'Predictive maintenance pipeline: 30% downtime reduction across 70-machine cluster',
      'LLM fine-tuned on 10K internal docs: 80% first-contact resolution, BLEU 0.82',
    ],
    tags: ['PPO', 'Ray RLlib', 'PyTorch', 'GCP', 'Docker'],
  },
  {
    title: 'Data Scientist',
    company: 'Dentsu International',
    period: 'Aug 2020 - Jan 2022',
    location: 'Singapore',
    achievements: [
      'ROAS prediction models: 50% faster post-campaign analysis, 20% cost reduction',
      'Customer propensity model: 85% validation accuracy, deployed to live campaigns',
      'Data catalog on Azure AKS: ingesting 10,000+ datasets for enterprise governance',
    ],
    tags: ['Python', 'SQL', 'Tableau', 'Azure', 'Terraform'],
  },
];

// The one source of truth for capabilities. Skills.jsx renders the headline
// groups from CAPABILITIES; this longer list backs the résumé.
export const CAPABILITIES = [
  ['Applied AI', 'Agentic systems, RAG, fine-tuning, tool use and prompt design'],
  ['Evaluation', 'LLM-as-judge, RAGAS, retrieval quality, release regression and MLflow'],
  ['Engineering', 'Python, FastAPI, PostgreSQL, Redis, Docker and Kubernetes'],
  ['Platforms', 'Azure AI Foundry, AKS, GCP, AWS, Qdrant, KServe and production monitoring'],
];

export const SKILLS = {
  'Applied AI & Agents': ['OpenAI Agents SDK', 'LangGraph', 'LangChain', 'Multi-agent orchestration', 'RAG', 'GPT-4o', 'LangSmith'],
  'Evaluation & Governance': ['LLM-as-judge', 'RAGAS', 'Release regression', 'Prompt-safety controls', 'Human-in-the-loop', 'MLflow'],
  'ML & Modeling': ['PPO', 'Ray RLlib', 'QLoRA / PEFT', 'PyTorch', 'TensorFlow', 'Hugging Face', 'XGBoost', 'SHAP / LIME'],
  'Cloud & Infrastructure': ['Azure AI Foundry', 'Azure OpenAI', 'AKS', 'Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'Entra ID'],
  'MLOps & Backend': ['FastAPI', 'PostgreSQL', 'Row-level security', 'KServe', 'Prometheus', 'Grafana', 'GitHub Actions', 'Azure DevOps'],
  'Data & Interfaces': ['PostgreSQL / pgvector', 'Qdrant', 'Redis', 'Snowflake', 'Airflow', 'SQL', 'React', 'TypeScript'],
};

export const EDUCATION = [
  {
    degree: 'MSc IT in Business, Artificial Intelligence',
    school: 'Singapore Management University',
    period: 'Jan 2019 - May 2020',
  },
  {
    degree: 'BTech Computer Science',
    school: 'University of Petroleum and Energy Studies, India',
    period: 'Aug 2014 - Apr 2018',
  },
];

export const SOCIAL = [
  { label: 'GitHub',   href: 'https://github.com/Pranav63',                  icon: 'github'   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranavarora63/',   icon: 'linkedin' },
  { label: 'Email',    href: 'mailto:pranav2vis@gmail.com',                  icon: 'mail'     },
];
