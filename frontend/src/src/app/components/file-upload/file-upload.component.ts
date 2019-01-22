import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  constructor(public backendService: BackendService) { }

  @ViewChild('file') file;
  public files: Set<File> = new Set();
  uploaded = 0;

  ngOnInit() {
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    // Clear the list
    this.files.clear();

    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  uploadFile() {
    // start the upload and save the progress map
    this.backendService.upload(this.files);
    this.uploaded++;
  }
  reset() {
    this.uploaded = 0;
    this.files.clear();
    this.file.nativeElement.value = '';
  }
}
