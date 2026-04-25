import { permanentRedirect } from 'next/navigation';

export default function CorporatePage() {
  permanentRedirect('/contact?intent=corporate');
}
