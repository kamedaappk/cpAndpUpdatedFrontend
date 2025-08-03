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