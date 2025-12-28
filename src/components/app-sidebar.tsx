'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Bot, MessageSquarePlus, History, PanelLeft } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

export function AppSidebar() {
    const { open, setOpen, isMobile } = useSidebar();
    
    return (
        <>
            <div className="absolute top-4 left-4 z-20 md:hidden">
                <SidebarTrigger />
            </div>
            <Sidebar>
                <SidebarContent>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                    <Bot className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-400">
                        Ingredient AI
                    </h1>
                    </div>
                </SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => window.location.reload()}>
                        <MessageSquarePlus />
                        New Analysis
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="mt-auto p-2 text-sm font-medium text-neutral-400 flex items-center gap-2">
                    <History className="h-4 w-4"/>
                    <span>History</span>
                </div>
                {/* Placeholder for chat history */}
                </SidebarContent>
            </Sidebar>
        </>
    )
}
