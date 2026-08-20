export const PROJECTS = [
  {
    id: 'trading-agent',
    title: 'Risk-Controlled AI Trading Agent',
    subtitle: 'Turns financial news into paper-trading decisions with human approval',
    description:
      'Reads financial news, confirms the signal with technical indicators, and prepares a paper trade for human approval. Every decision is logged for review.',
    tags: ['FastAPI', 'Next.js', 'Redis', 'PostgreSQL', 'Groq', 'Alpaca'],
    metrics: ['15-min News Cycle', '55% Confidence Gate', 'Paper Trading Only'],
    status: 'SOURCE VERIFIED',
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
    live: 'https://github.com/Pranav63/trading-quant-ai-agent',
    accent: '#C9A84C',
  },
  {
    id: 'rag-eval',
    title: 'Production RAG Evaluation System',
    subtitle: 'Answers questions from research papers and measures answer quality',
    description:
      'A question-answering system over 73 AI research papers: hybrid search, reranking, and a dashboard that tracks answer quality and speed.',
    tags: ['BGE-M3', 'Qdrant', 'CrossEncoder', 'PostgreSQL', 'Streamlit', 'Python'],
    metrics: ['3.6 / 5 Judge Score', '~950ms Avg Query', '10-query Evaluation'],
    status: 'RESULTS DOCUMENTED',
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
    live: 'https://github.com/Pranav63/production-rag-eval',
    accent: '#C9A84C',
  },
  {
    id: 'qlora',
    title: 'Arabic-English QLoRA Fine-tuning',
    subtitle: 'Teaches a compact model how Gulf professionals naturally mix Arabic and English',
    description:
      'A fine-tuning pipeline for Qwen2.5-3B that learns the Arabic-English code-switching used in Gulf workplaces: dataset prep, lightweight adapter training tracked in MLflow, and a base-versus-tuned comparison on the same prompts.',
    tags: ['Qwen2.5', 'QLoRA', 'PEFT', 'MLflow', 'Hugging Face', 'Arabic NLP'],
    metrics: ['34.7% Code-switch Ratio', '+584% vs Base', '653 Clean Samples'],
    status: 'RAW OUTPUTS COMMITTED',
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
    live: 'https://github.com/Pranav63/qlora-multilingual-finetuning',
    accent: '#8B6F47',
  },
];

export const EXPERIENCE = [
  {
    title: 'Applied AI Scientist',
    company: 'Inception · a G42 company',
    period: 'Jul 2026 - Present',
    location: 'Abu Dhabi, UAE',
    achievements: [
      'Building applied AI systems from Abu Dhabi for high-impact, real-world use cases',
      'Focused on agentic architectures, evaluation, reliability and production delivery',
    ],
    tags: ['Applied AI', 'Agentic Systems', 'LLMs', 'Evaluation', 'Production Engineering'],
  },
  {
    title: 'Senior ML Engineer',
    company: 'Hewlett Packard Enterprise',
    period: 'Aug 2024 - Completed',
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

export const SKILLS = {
  'Agentic AI & LLMs': ['LangGraph', 'LangChain', 'GPT-4o', 'RAG', 'Multi-Agent', 'Prompt Engineering', 'vLLM', 'HuggingFace'],
  'ML & Modeling': ['PPO / RL', 'QLoRA / PEFT', 'XGBoost', 'PyTorch', 'TensorFlow', 'Fine-tuning', 'SHAP / LIME'],
  'Cloud & Infra': ['Azure (primary)', 'Kubernetes', 'Docker', 'AWS', 'GCP', 'FastAPI', 'Keycloak'],
  'MLOps': ['MLflow', 'KServe', 'Prometheus', 'Grafana', 'Azure DevOps', 'GitHub Actions'],
  'Data & Vector': ['PostgreSQL', 'Qdrant', 'Redis', 'Pinecone', 'Supabase', 'Snowflake'],
};

export const SOCIAL = [
  { label: 'GitHub',   href: 'https://github.com/Pranav63',                  icon: 'github'   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranavarora63/',   icon: 'linkedin' },
  { label: 'Email',    href: 'mailto:pranav2vis@gmail.com',                  icon: 'mail'     },
];
