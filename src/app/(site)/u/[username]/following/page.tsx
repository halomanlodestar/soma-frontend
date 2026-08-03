import { FollowListPage } from "@/modules/user/components/FollowListPage";

interface FollowingPageProps {
  params: Promise<{ username: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { username } = await params;

  return <FollowListPage username={username} kind="following" />;
}
