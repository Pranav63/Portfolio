import Navigation from '@/components/ui/Navigation';
import PageFooter from '@/components/ui/PageFooter';
import FieldNotes from '@/components/sections/FieldNotes';

const title = 'Field Notes | Pranav Arora';
const description = 'Notes on retrieval evaluation, human approval in agentic systems, and Arabic-English fine-tuning.';
export const metadata = { title, description, alternates: { canonical: '/writing' }, openGraph: { title, description, url: '/writing' }, twitter: { title, description } };

export default function WritingPage() {
  return <><Navigation /><main id="main" className="writing-page"><header className="page-shell page-heading"><p className="section-label">Writing</p><h1>Notes from building.</h1><p className="page-lead">Decisions, observations, and open questions from my personal AI projects. Each note links back to its evidence.</p></header><FieldNotes /></main><PageFooter /></>;
}
