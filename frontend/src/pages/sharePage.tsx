
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Card } from '../components/Card';
import { Sidebar } from '../components/Sidebar';

    type ContentType = 'youtube' | 'twitter' | 'article';
    type FilterType = 'all' | ContentType;

    interface Content {
        _id: string;
        title: string;
        link: string;
        type: ContentType;
        content?: string;
    }

    interface SharedData {
        username: string;
        content: Content[];
    }

    export function SharePage() {
        const { shareLink = '' } = useParams();
        const [data, setData] = useState<SharedData | null>(null);
        const [sideType, setSideType] = useState<FilterType>('all');
        const [error, setError] = useState('');

        useEffect(() => {
            if (!shareLink) return;

            let active = true;
            const socketUrl = new URL(`/ws/share/${shareLink}`, BACKEND_URL);
            socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';

            axios.get<SharedData>(`${BACKEND_URL}/share/${shareLink}`)
                .then((response) => {
                    if (active) setData(response.data);
                })
                .catch(() => {
                    if (active) setError('This share link is invalid or no longer available.');
                });

            const socket = new WebSocket(socketUrl);
            socket.onmessage = (event) => {
                if (!active) return;
                try {
                    setData(JSON.parse(event.data) as SharedData);
                    setError('');
                } catch {
                    setError('Unable to update shared content.');
                }
            };

            return () => {
                active = false;
                socket.close();
            };
        }, [shareLink]);

        const visibleContent = data?.content.filter((item) => sideType === 'all' || item.type === sideType) ?? [];

        return (
            <div className="min-h-screen bg-gray-200">
                <Sidebar setSidetype={setSideType} showAll={false} />
                <main className="ml-[190px] min-h-screen p-6">
                    <header className="fixed top-0 right-0 left-[190px] z-10 bg-gray-700 px-6 py-4 text-white">
                        <h1 className="text-lg font-semibold">{data ? `Shared by ${data.username}` : 'Shared Brain'}</h1>
                    </header>
                    <section className="mt-16 flex flex-wrap items-start gap-4 p-3">
                        {error && <p role="alert" className="text-red-700">{error}</p>}
                        {!data && !error && <p>Loading shared content...</p>}
                        {data && visibleContent.map((item) => (
                            <Card
                                key={item._id}
                                contentId={item._id}
                                type={item.type}
                                link={item.link}
                                title={item.title}
                                content={item.content}
                                readOnly
                            />
                        ))}
                        {data && visibleContent.length === 0 && <p>No content in this view.</p>}
                    </section>
                </main>
            </div>
        );
    }