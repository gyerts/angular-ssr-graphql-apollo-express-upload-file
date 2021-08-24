import {Component} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

const SINGLE_UPLOAD = gql`
  mutation($file: Upload!, $name: String!) {
    singleUpload(file: $file, name: $name) {
      filename
      mimetype
      encoding
    }
  }
`;

@Component({
  selector: 'app-root',
  template: `
    <input type="file" required (change)="handleChange($event)" />
  `,
})
export class AppComponent {
  constructor(private apollo: Apollo) {}

  handleChange(e: Event) {
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
          name: target.files[0].name
        }})
        .subscribe((d: any) => {
          console.log('file uploaded')
          console.log(d)
        });
    }
  }
}
