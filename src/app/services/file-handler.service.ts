import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  private dataUrl = 'assets/data.json'; // Path to your JSON file

  constructor(
    private http: HttpClient,
    private configurationsService: ConfigurationsService
  ) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  /**
   * Handles file upload with size validation
   * @param file The file to upload
   * @returns Observable with upload result
   */
  uploadFile(file: File): Observable<any> {
    return new Observable((observer) => {
      // Get the maximum allowed size from configurations
      const maxFileSize = this.configurationsService.getMaxUploadSize();

      // Validate file size
      if (file.size > maxFileSize) {
        observer.error({
          error: 'File too large',
          message: `File size (${this.formatFileSize(file.size)}) exceeds the maximum limit of ${this.formatFileSize(maxFileSize)}.`
        });
        observer.complete();
        return;
      }

      // Here you would typically upload the file to a server
      // For now, we'll just return a success response
      // In a real implementation, you would use HttpClient to POST the file
      observer.next({
        success: true,
        fileName: file.name,
        fileSize: file.size,
        message: 'File uploaded successfully'
      });
      observer.complete();
    });
  }

  /**
   * Helper method to format file size in human readable format
   * @param bytes Size in bytes
   * @returns Formatted string (e.g., "5.2 MB")
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
