export interface Overview {
  summary: string;
  audience: string;
  businessModel: string;
  sourceUrl: string;
  checkedAt: number;
  overlap?: string;
}

export function BusinessOverview({ profile, competitor = false }: { profile: Overview; competitor?: boolean }) {
  return <div className="business-overview">
    <p>{profile.summary}</p>
    <dl>
      <dt>Audience</dt><dd>{profile.audience || "Not established"}</dd>
      <dt>Business model</dt><dd>{profile.businessModel || "Not established"}</dd>
      {competitor && <><dt>Why it competes</dt><dd>{profile.overlap || "Not established"}</dd></>}
    </dl>
    <a className="fine-print text-link" href={profile.sourceUrl} target="_blank" rel="noreferrer">
      Source · Checked {new Date(profile.checkedAt).toISOString().slice(0, 10)}
    </a>
  </div>;
}
