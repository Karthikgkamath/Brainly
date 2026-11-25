import { Brainlylogo } from "./icons/Brainlylogo";
import { Twitter } from "./icons/Twitter";
import { Youtube } from "./icons/Youtube";
import { SidebarItem } from "./SidebarItem";
import { Article } from "./icons/article";
import { All } from "./icons/all";
import { useState } from "react";

type ContentType = 'all' | 'youtube' | 'twitter' | 'article';

export function Sidebar({ setSidetype, showAll = true }: {
    setSidetype: (type: ContentType) => void,
    showAll?: boolean
}) {
    const [active, setActive] = useState<ContentType>('all');

    return (
        <div className="h-screen bg-white shadow-md w-[190px] fixed top-0 left-0">
            <div className="flex items-center text-3xl m-4">
                <div className="mr-2 text-purple-800">
                    <Brainlylogo />
                </div>
                Brainly
            </div>

            <div className="pt-11 pl-1.5">
                {showAll && <SidebarItem
                    onClick={() => {
                        setSidetype('all');
                        setActive('all');
                    }}
                    text="All"
                    variant={active === 'all' ? 'primary' : 'secondary'}
                    icon={<All />}
                />}

                <SidebarItem
                    onClick={() => {
                        setSidetype('article');
                        setActive('article');
                    }}
                    text="Article"
                    variant={active === 'article' ? 'primary' : 'secondary'}
                    icon={<Article />}
                />

                <SidebarItem
                    onClick={() => {
                        setSidetype('twitter');
                        setActive('twitter');
                    }}
                    text="Twitter"
                    variant={active === 'twitter' ? 'primary' : 'secondary'}
                    icon={<Twitter />}
                />

                <SidebarItem
                    onClick={() => {
                        setSidetype('youtube');
                        setActive('youtube');
                    }}
                    text="Youtube"
                    variant={active === 'youtube' ? 'primary' : 'secondary'}
                    icon={<Youtube />}
                />
            </div>
        </div>
    );
}