import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-changelog',
    templateUrl: './changelog.component.html',
    styleUrl: './changelog.component.css',
    imports: [FormsModule, CommonModule],
    standalone: true
})
export class ChangelogComponent {
    @Output() close = new EventEmitter<void>();

    changelog = [

        {
            date: '2026-06-16',
            title: 'Room Refresh functionality',
            description: 'Updated the Room Ui with Room refresh button, on clicking which refreshes the rooms data and loads the latest messages.'
        },
        {
            date: '2025-09-16',
            title: 'Text Formatting Preservation',
            description: 'Updated the message input to use a textarea instead of a single-line input field, and added CSS to preserve line breaks and whitespace when displaying messages. This allows users to enter multi-line messages with proper formatting preserved.'
        },
        {
            date: '2025-08-03',
            title: 'Independent Endpoint Status Display',
            description: 'Updated backend endpoint checking to display active/inactive status independently for each endpoint. Each endpoint now updates in real-time as its status is determined, rather than waiting for all endpoints to be checked. Also updated the display to show endpoint titles instead of URLs for better user experience.'
        },
        {
            date: '2025-08-03',
            title: 'File Size Limit Configuration',
            description: 'Added configurable maximum upload file size limit with default 5 MB. Users can now set limits between 1-100 MB using a slider interface.'
        },
        {
            date: '2025-08-03',
            title: 'Dest.Change',
            description: 'Moved Reset and List Rooms to Configurations Component.'
        },
        {
            date: '2025-07-25B',
            title: 'Dark Theme Release',
            description: 'Launched the Dark Theme feature! 🎉'
        },
        {
            date: '2025-07-25',
            title: 'Initial Release',
            description: 'Launched the changelog feature! 🎉'
        },
        {
            date: '2024-09-04',
            title: 'Room Collaboration',
            description: 'Added real-time room collaboration and file sharing.'
        }
        // Add more entries as needed
    ];
}