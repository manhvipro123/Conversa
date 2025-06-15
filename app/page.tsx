import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {getAllCompanions, getBookmarkedCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";
import {currentUser} from "@clerk/nextjs/server";

const Page = async () => {
    const companions = await getAllCompanions({limit: 3});
    const recentSessionsCompanions = await getRecentSessions(10);

    const user = await currentUser();

    // @ts-ignore
    let bookmarkedCompanions: any[] = [];

    if (user) {
        bookmarkedCompanions = await getBookmarkedCompanions(user.id);
    }


    const companionsToShow = companions.map((companion) => {
        return {
            ...companion,
            bookmarked: bookmarkedCompanions.some(bookmark => bookmark.id === companion.id)
        };
    });

    console.log(companionsToShow);

    return (
        <main>
            <h1>Popular Companions</h1>

            <section className="home-section">
                {companionsToShow.map((companion) => (
                    <CompanionCard key={companion.id} {...companion}
                                   classNames="w-1/3 max-lg:w-full"
                                   color={getSubjectColor(companion.subject)}/>
                ))}
            </section>

            <section className="home-section">
                <CompanionList
                    title="Recently completed sessions"
                    companions={recentSessionsCompanions}
                    classNames="w-2/3 max-lg:w-full"/>
                <CTA/>
            </section>
        </main>
    )
}

export default Page