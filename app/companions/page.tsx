import {getAllCompanions, getBookmarkedCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import {currentUser} from "@clerk/nextjs/server";

const CompanionsLibrary = async ({searchParams}: SearchParams) => {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';
    const user = await currentUser();

    // @ts-ignore
    let bookmarkedCompanions: any[] = [];

    const companions = await getAllCompanions({subject, topic});
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
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <h1>Companion Library</h1>
                <div className="flex gap-4">
                    <SearchInput/>
                    <SubjectFilter/>
                </div>
            </section>
            <section className="companions-grid">
                {
                    companionsToShow.map((companion) => (
                        <CompanionCard key={companion.id} {...companion}
                                       color={getSubjectColor(companion.subject)}/>
                    ))
                }
            </section>
        </main>
    )
}
export default CompanionsLibrary
