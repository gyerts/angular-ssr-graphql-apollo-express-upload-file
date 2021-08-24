import {Component} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

const SINGLE_UPLOAD = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

const MULTI_UPLOAD = gql`
  mutation($files: [Upload]!) {
    multiUpload(files: $files) {
      filename
      mimetype
      encoding
    }
  }
`;

@Component({
  selector: 'app-root',
  template: `
    <pre>To see result of application, upload some file and check <b>uploaded_files</b> folder on server</pre>
    <pre>Also check logs in terminal and browser</pre>
    <pre>Also check network tab</pre>

    <h1>Single file upload</h1>
    <input type="file" required (change)="handleSingleChange($event)" />

    <h1>Multi files upload</h1>
    <input multiple type="file" required (change)="handleMultiChange($event)" />
  `,
})
export class AppComponent {
  constructor(private apollo: Apollo) {}

  handleSingleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {

      console.log('++++++++++++++++++++++++++++++++++++++++++');
      console.log("input", target.files[0])
      console.log('++++++++++++++++++++++++++++++++++++++++++');

      this.apollo.mutate({
        mutation: SINGLE_UPLOAD,
        context: {
          useMultipart: true
        },
        variables: {
          file: target.files[0],
        }})
        .subscribe((d: any) => {
          console.log('file uploaded')
          console.log(d)
        });
    }
  }
  handleMultiChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {

      console.log('++++++++++++++++++++++++++++++++++++++++++');
      console.log("input", target.files)
      console.log('++++++++++++++++++++++++++++++++++++++++++');

      this.apollo.mutate({
        mutation: MULTI_UPLOAD,
        context: {
          useMultipart: true
        },
        variables: {
          files: target.files,
        }})
        .subscribe((d: any) => {
          console.log('files uploaded')
          console.log(d)
        });
    }
  }
}
