export interface TranslationKeys {
  navHome: string;
  navServices: string;
  navDoctors: string;
  navGallery: string;
  navVacancies: string;
  navAbout: string;
  navContact: string;
  navLogin: string;
  navLogout: string;
  navAdminPanel: string;

  heroTitle: string;
  heroSubtitle: string;
  bookBtn: string;
  contactBtn: string;

  sectionServices: string;
  sectionServicesSub: string;
  sectionDoctors: string;
  sectionDoctorsSub: string;
  sectionGallery: string;
  sectionGallerySub: string;
  sectionVacancies: string;
  sectionVacanciesSub: string;
  sectionAbout: string;
  sectionAboutSub: string;
  sectionContact: string;
  sectionContactSub: string;

  workingHours: string;
  workingHoursWeek: string;
  workingHoursSat: string;
  workingHoursSun: string;

  loginTitle: string;
  loginSubtitle: string;
  username: string;
  password: string;
  loginButton: string;
  loginError: string;

  adminSidebarDashboard: string;
  adminSidebarServices: string;
  adminSidebarDoctors: string;
  adminSidebarGallery: string;
  adminSidebarVacancies: string;
  adminSidebarAbout: string;
  adminSidebarContact: string;
  adminSidebarSettings: string;

  adminDashboardWelcome: string;
  adminDashboardWelcomeSub: string;
  adminTotalServices: string;
  adminTotalDoctors: string;
  adminTotalGallery: string;
  adminTotalVacancies: string;

  active: string;
  inactive: string;
  edit: string;
  delete: string;
  actions: string;
  addBtn: string;
  cancelBtn: string;
  saveBtn: string;
  uploadImage: string;
  uploadLogo: string;
  uploadBg: string;
  noImage: string;

  fieldTitleKa: string;
  fieldTitleEn: string;
  fieldDescKa: string;
  fieldDescEn: string;
  fieldSlug: string;
  fieldSortOrder: string;
  fieldActive: string;
  fieldFirstNameKa: string;
  fieldFirstNameEn: string;
  fieldLastNameKa: string;
  fieldLastNameEn: string;
  fieldPositionKa: string;
  fieldPositionEn: string;

  fieldPhone1: string;
  fieldPhone2: string;
  fieldEmail: string;
  fieldAddressKa: string;
  fieldAddressEn: string;
  fieldFacebookUrl: string;
  fieldInstagramUrl: string;
  fieldLinkedinUrl: string;
  fieldYoutubeUrl: string;
  fieldGoogleMapsUrl: string;

  fieldClinicNameKa: string;
  fieldClinicNameEn: string;
  fieldSeoTitleKa: string;
  fieldSeoTitleEn: string;
  fieldSeoDescriptionKa: string;
  fieldSeoDescriptionEn: string;

  deleteConfirmation: string;
  saveSuccess: string;
  deleteSuccess: string;
  actionError: string;
  loading: string;
}

export type Language = 'ka' | 'en';

export const translations: Record<Language, TranslationKeys> = {
  ka: {
    navHome: 'მთავარი',
    navServices: 'სერვისები',
    navDoctors: 'ექიმები',
    navGallery: 'გალერეა',
    navVacancies: 'ვაკანსიები',
    navAbout: 'ჩვენს შესახებ',
    navContact: 'კონტაქტი',
    navLogin: 'ავტორიზაცია',
    navLogout: 'გასვლა',
    navAdminPanel: 'მართვის პანელი',

    heroTitle: 'ბელადენტი – თქვენი ღიმილის ფორმულა',
    heroSubtitle: 'უმაღლესი ხარისხის სტომატოლოგიური მომსახურება, თანამედროვე აპარატურა და პროფესიონალთა გუნდი თქვენს სამსახურში.',
    bookBtn: 'ჩაეწერეთ ექიმთან',
    contactBtn: 'დაგვიკავშირდით',

    sectionServices: 'ჩვენი სერვისები',
    sectionServicesSub: 'გთავაზობთ სტომატოლოგიური მომსახურების სრულ სპექტრს უახლესი მეთოდებით',
    sectionDoctors: 'ჩვენი ექიმები',
    sectionDoctorsSub: 'გაიცანით ბელადენტის მაღალკვალიფიციური პროფესიონალთა გუნდი',
    sectionGallery: 'ჩვენი კლინიკა',
    sectionGallerySub: 'გადაავლეთ თვალი ბელადენტის მყუდრო და თანამედროვე გარემოს',
    sectionVacancies: 'ვაკანსიები',
    sectionVacanciesSub: 'შემოუერთდით ჩვენს მზარდ და მეგობრულ გუნდს',
    sectionAbout: 'კლინიკის შესახებ',
    sectionAboutSub: 'ბელადენტი – 10 წელზე მეტია ზრუნავს თქვენს ჯანსაღ ღიმილზე',
    sectionContact: 'საკონტაქტო ინფორმაცია',
    sectionContactSub: 'დაგვიკავშირდით ნებისმიერ დროს ან გვეწვიეთ კლინიკაში',

    workingHours: 'სამუშაო საათები',
    workingHoursWeek: 'ორშაბათი - შაბათი: 10:00 - 20:00',
    workingHoursSat: 'შაბათი: 10:00 - 18:00',
    workingHoursSun: 'კვირა: დასვენება',

    loginTitle: 'მართვის პანელი',
    loginSubtitle: 'გაიარეთ ავტორიზაცია ადმინისტრატორის პანელში შესასვლელად',
    username: 'მომხმარებლის სახელი',
    password: 'პაროლი',
    loginButton: 'შესვლა',
    loginError: 'მომხმარებლის სახელი ან პაროლი არასწორია',

    adminSidebarDashboard: 'მთავარი',
    adminSidebarServices: 'სერვისები',
    adminSidebarDoctors: 'ექიმები',
    adminSidebarGallery: 'გალერეა',
    adminSidebarVacancies: 'ვაკანსიები',
    adminSidebarAbout: 'ჩვენს შესახებ',
    adminSidebarContact: 'საკონტაქტო ინფორმაცია',
    adminSidebarSettings: 'საიტის პარამეტრები',

    adminDashboardWelcome: 'მოგესალმებით, ადმინისტრატორო!',
    adminDashboardWelcomeSub: 'მართეთ კლინიკის საიტის კონტენტი მარტივად და სწრაფად.',
    adminTotalServices: 'აქტიური სერვისი',
    adminTotalDoctors: 'პროფესიონალი ექიმი',
    adminTotalGallery: 'გალერეის სურათი',
    adminTotalVacancies: 'აქტიური ვაკანსია',

    active: 'აქტიური',
    inactive: 'არააქტიური',
    edit: 'რედაქტირება',
    delete: 'წაშლა',
    actions: 'მოქმედებები',
    addBtn: 'ახლის დამატება',
    cancelBtn: 'გაუქმება',
    saveBtn: 'შენახვა',
    uploadImage: 'სურათის ატვირთვა',
    uploadLogo: 'ლოგოს ატვირთვა',
    uploadBg: 'ფონის ატვირთვა',
    noImage: 'სურათი არ არის',

    fieldTitleKa: 'სათაური (ქართულად)',
    fieldTitleEn: 'სათაური (ინგლისურად)',
    fieldDescKa: 'აღწერა (ქართულად)',
    fieldDescEn: 'აღწერა (ინგლისურად)',
    fieldSlug: 'ბმული (slug)',
    fieldSortOrder: 'სორტირების რიგი',
    fieldActive: 'აქტიურია',
    fieldFirstNameKa: 'სახელი (ქართულად)',
    fieldFirstNameEn: 'სახელი (ინგლისურად)',
    fieldLastNameKa: 'გვარი (ქართულად)',
    fieldLastNameEn: 'გვარი (ინგლისურად)',
    fieldPositionKa: 'პოზიცია (ქართულად)',
    fieldPositionEn: 'პოზიცია (ინგლისურად)',

    fieldPhone1: 'ტელეფონი 1',
    fieldPhone2: 'ტელეფონი 2',
    fieldEmail: 'ელ-ფოსტა',
    fieldAddressKa: 'მისამართი (ქართულად)',
    fieldAddressEn: 'მისამართი (ინგლისურად)',
    fieldFacebookUrl: 'Facebook ბმული',
    fieldInstagramUrl: 'Instagram ბმული',
    fieldLinkedinUrl: 'LinkedIn ბმული',
    fieldYoutubeUrl: 'YouTube ბმული',
    fieldGoogleMapsUrl: 'Google Maps რუკის iframe ბმული',

    fieldClinicNameKa: 'კლინიკის სახელი (ქართულად)',
    fieldClinicNameEn: 'კლინიკის სახელი (ინგლისურად)',
    fieldSeoTitleKa: 'SEO სათაური (ქართულად)',
    fieldSeoTitleEn: 'SEO სათაური (ინგლისურად)',
    fieldSeoDescriptionKa: 'SEO აღწერა (ქართულად)',
    fieldSeoDescriptionEn: 'SEO აღწერა (ინგლისურად)',

    deleteConfirmation: 'დარწმუნებული ხართ, რომ გსურთ ამ ჩანაწერის წაშლა?',
    saveSuccess: 'მონაცემები წარმატებით შეინახა!',
    deleteSuccess: 'ჩანაწერი წარმატებით წაიშალა!',
    actionError: 'დაფიქსირდა შეცდომა!',
    loading: 'იტვირთება...',
  },
  en: {
    navHome: 'Home',
    navServices: 'Services',
    navDoctors: 'Doctors',
    navGallery: 'Gallery',
    navVacancies: 'Vacancies',
    navAbout: 'About Us',
    navContact: 'Contact',
    navLogin: 'Login',
    navLogout: 'Logout',
    navAdminPanel: 'Dashboard',

    heroTitle: 'BelaDent – The Formula for Your Smile',
    heroSubtitle: 'High-quality dental care, state-of-the-art medical equipment, and a highly professional team at your service.',
    bookBtn: 'Book Appointment',
    contactBtn: 'Contact Us',

    sectionServices: 'Our Services',
    sectionServicesSub: 'We offer a full spectrum of dental treatments using modern methods',
    sectionDoctors: 'Our Specialists',
    sectionDoctorsSub: 'Meet the highly qualified team of professionals at BelaDent',
    sectionGallery: 'Our Clinic',
    sectionGallerySub: 'Take a virtual tour through the cozy and modern space of BelaDent',
    sectionVacancies: 'Careers',
    sectionVacanciesSub: 'Join our growing, friendly, and professional team',
    sectionAbout: 'About BelaDent',
    sectionAboutSub: 'BelaDent – caring for your beautiful and healthy smile for over 10 years',
    sectionContact: 'Get in Touch',
    sectionContactSub: 'Contact us anytime or visit our modern clinic in person',

    workingHours: 'Working Hours',
    workingHoursWeek: 'Monday - Saturday: 10:00 - 20:00',
    workingHoursSat: 'Saturday: 10:00 - 18:00',
    workingHoursSun: 'Sunday: Closed',

    loginTitle: 'Admin Console',
    loginSubtitle: 'Please log in to manage your site configuration',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign In',
    loginError: 'Invalid username or password',

    adminSidebarDashboard: 'Home',
    adminSidebarServices: 'Services',
    adminSidebarDoctors: 'Doctors',
    adminSidebarGallery: 'Gallery',
    adminSidebarVacancies: 'Vacancies',
    adminSidebarAbout: 'About Page',
    adminSidebarContact: 'Contact Page',
    adminSidebarSettings: 'Site Settings',

    adminDashboardWelcome: 'Welcome Back, Admin!',
    adminDashboardWelcomeSub: 'Easily modify and update your clinic website content in real time.',
    adminTotalServices: 'Active Services',
    adminTotalDoctors: 'Dentists / Doctors',
    adminTotalGallery: 'Gallery Photos',
    adminTotalVacancies: 'Job Postings',

    active: 'Active',
    inactive: 'Inactive',
    edit: 'Edit',
    delete: 'Delete',
    actions: 'Actions',
    addBtn: 'Add New',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Details',
    uploadImage: 'Upload Photo',
    uploadLogo: 'Upload Logo',
    uploadBg: 'Upload Background',
    noImage: 'No Image available',

    fieldTitleKa: 'Title (Georgian)',
    fieldTitleEn: 'Title (English)',
    fieldDescKa: 'Description (Georgian)',
    fieldDescEn: 'Description (English)',
    fieldSlug: 'Slug URL path',
    fieldSortOrder: 'Sort Order index',
    fieldActive: 'Is Active',
    fieldFirstNameKa: 'First Name (Georgian)',
    fieldFirstNameEn: 'First Name (English)',
    fieldLastNameKa: 'Last Name (Georgian)',
    fieldLastNameEn: 'Last Name (English)',
    fieldPositionKa: 'Position (Georgian)',
    fieldPositionEn: 'Position (English)',

    fieldPhone1: 'Phone Number 1',
    fieldPhone2: 'Phone Number 2',
    fieldEmail: 'Email Address',
    fieldAddressKa: 'Street Address (Georgian)',
    fieldAddressEn: 'Street Address (English)',
    fieldFacebookUrl: 'Facebook Profile URL',
    fieldInstagramUrl: 'Instagram Profile URL',
    fieldLinkedinUrl: 'LinkedIn Profile URL',
    fieldYoutubeUrl: 'YouTube Channel URL',
    fieldGoogleMapsUrl: 'Google Maps Embedded iframe URL',

    fieldClinicNameKa: 'Clinic Name (Georgian)',
    fieldClinicNameEn: 'Clinic Name (English)',
    fieldSeoTitleKa: 'SEO Title (Georgian)',
    fieldSeoTitleEn: 'SEO Title (English)',
    fieldSeoDescriptionKa: 'SEO Description (Georgian)',
    fieldSeoDescriptionEn: 'SEO Description (English)',

    deleteConfirmation: 'Are you absolutely sure you want to delete this record?',
    saveSuccess: 'Data saved successfully!',
    deleteSuccess: 'Record removed successfully!',
    actionError: 'Something went wrong!',
    loading: 'Loading items...',
  },
};
