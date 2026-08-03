import { FollowListPage } from "@/modules/user/components/FollowListPage";

interface FollowersPageProps {
  params: Promise<{ username: string }>;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { username } = await params;

  return <FollowListPage username={username} kind="followers" />;
}
