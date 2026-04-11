export interface RecruiterJob {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogoUrl: string | null;
  location: string;
  locationType: "ONSITE" | "HYBRID" | "REMOTE";
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryMin: number | null;
  salaryMax: number | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  category: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  about: string;
  term: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}
