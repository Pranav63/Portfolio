'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Waypoint from './Waypoint';

// Trimmed and ranked. First two items in each row are featured.
// Depth signal beats breadth signal at senior level.
const SKILLS = [
  {
    category: 'Agentic AI & LLMs',
    items: ['LangGraph', 'Multi-Agent Orchestration', 'LangChain', 'RAG Systems', 'Function Calling', 'MCP', 'Prompt Engineering'],
  },
  {
    category: 'Model Development',
    items: ['QLoRA / PEFT Fine-tuning', 'PPO / Ray RLlib', 'vLLM', 'PyTorch', 'HuggingFace', 'XGBoost', 'SHAP'],
  },
  {
    category: 'Evaluation & Observability',
    items: ['RAGAS', 'LLM-as-Judge', 'MLflow', 'Langfuse / LangSmith', 'Prometheus', 'Grafana', 'Drift Detection'],
  },
  {
    category: 'Cloud & Infra',
    items: ['Azure OpenAI / AI Foundry', 'Kubernetes', 'AKS / EKS', 'Istio', 'Docker', 'Keycloak', 'AWS SageMaker', 'GCP Vertex AI'],
  },
  {
    category: 'MLOps & Deployment',
    items: ['KServe', 'FastAPI', 'CI/CD (Jenkins, GH Actions)', 'HashiCorp Vault', 'BentoML', 'Azure Container Apps'],
  },
  {
    category: 'Data & Vector Stores',
    items: ['PostgreSQL + pgvector', 'Qdrant', 'Redis', 'Airflow', 'Snowflake', 'Supabase'],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section-waypoint" ref={ref}>
      <div className="section-scrim" />

      <div className="section-inner">
        <Waypoint id="03" time="13:00" phase="High sun" inView={inView} />

        <motion.h2
          className="section-title"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
        >
          The <em>toolkit</em>
        </motion.h2>

        <motion.p
          className="section-lede"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={2}
        >
          Full lifecycle: fine-tune the model, deploy it on Kubernetes, watch it
          in production. The first two in each row are where I go deepest.
        </motion.p>

        <div>
          {SKILLS.map((group, gi) => (
            <motion.div
              className="spec-row"
              key={group.category}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={gi + 3}
            >
              <span className="spec-label">{group.category}</span>
              <div className="spec-items">
                {group.items.map((skill, si) => (
                  <span
                    key={skill}
                    className={`spec-item${si < 2 ? ' featured' : ''}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}