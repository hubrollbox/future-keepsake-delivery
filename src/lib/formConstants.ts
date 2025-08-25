import * as z from "zod"

export const formSchema = z.object({
  email: z.string().email(),
})

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  name: z.string().max(30, { message: "Name must not be longer than 30 characters." }).optional(),
  dob: z.date().optional(),
  bio: z.string().max(160, { message: "Bio must not be longer than 160 characters." }).optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  font: z.enum(["inter", "lora", "raleway"], {
    required_error: "Please select a font.",
  }),
})

export const notificationsFormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You have to select one item.",
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean().default(false).optional(),
})

export const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})

export const keepsakeFormSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address"),
  deliveryDate: z.date().min(new Date(), "Delivery date must be in the future"),
  message: z.string().min(1, "Message is required"),
  image: z.string().url("Invalid image URL").optional(),
});

export const createDeliveryFormSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address"),
  deliveryDate: z.date().min(new Date(), "Delivery date must be in the future"),
  message: z.string().min(1, "Message is required"),
  image: z.string().url("Invalid image URL").optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export const newsletterFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

export const deleteAccountFormSchema = z.object({
  password: z.string().min(6, "Password is required"),
});

export const twoFactorAuthFormSchema = z.object({
  code: z.string().min(6, "Code is required"),
});

export const verifyEmailFormSchema = z.object({
  code: z.string().min(6, "Code is required"),
});

export const createKeepsakeFormSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address"),
  deliveryDate: z.date().min(new Date(), "Delivery date must be in the future"),
  message: z.string().min(1, "Message is required"),
  image: z.string().url("Invalid image URL").optional(),
});

export const updateKeepsakeFormSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address"),
  deliveryDate: z.date().min(new Date(), "Delivery date must be in the future"),
  message: z.string().min(1, "Message is required"),
  image: z.string().url("Invalid image URL").optional(),
});

export const createRecipientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const updateRecipientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const createDeliveryMethodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const updateDeliveryMethodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const createPaymentMethodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const updatePaymentMethodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const createProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().url("Invalid image URL").optional(),
});

export const updateProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().url("Invalid image URL").optional(),
});

export const createOrderFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const updateOrderFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const createReviewFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export const updateReviewFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export const createSupportTicketFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const updateSupportTicketFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const createUserFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const updateUserFormSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const createWarehouseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
});

export const updateWarehouseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
});

export const createCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createTagFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const updateTagFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const createCollectionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateCollectionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createCouponFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discount: z.number().min(0, "Discount must be a positive number"),
  expiryDate: z.date().min(new Date(), "Expiry date must be in the future"),
});

export const updateCouponFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discount: z.number().min(0, "Discount must be a positive number"),
  expiryDate: z.date().min(new Date(), "Expiry date must be in the future"),
});

export const createShippingAddressFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export const updateShippingAddressFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export const createBillingAddressFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export const updateBillingAddressFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export const createWishlistFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateWishlistFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createCartFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const updateCartFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const createCheckoutFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  shippingAddressId: z.string().min(1, "Shipping address ID is required"),
  billingAddressId: z.string().min(1, "Billing address ID is required"),
  paymentMethodId: z.string().min(1, "Payment method ID is required"),
});

export const updateCheckoutFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  shippingAddressId: z.string().min(1, "Shipping address ID is required"),
  billingAddressId: z.string().min(1, "Billing address ID is required"),
  paymentMethodId: z.string().min(1, "Payment method ID is required"),
});

export const createNotificationFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  message: z.string().min(1, "Message is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateNotificationFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  message: z.string().min(1, "Message is required"),
  type: z.string().min(1, "Type is required"),
});

export const createLogFormSchema = z.object({
  level: z.string().min(1, "Level is required"),
  message: z.string().min(1, "Message is required"),
  timestamp: z.date().min(new Date(), "Timestamp is required"),
});

export const updateLogFormSchema = z.object({
  level: z.string().min(1, "Level is required"),
  message: z.string().min(1, "Message is required"),
  timestamp: z.date().min(new Date(), "Timestamp is required"),
});

export const createSettingFormSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

export const updateSettingFormSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

export const createAnalyticsFormSchema = z.object({
  event: z.string().min(1, "Event is required"),
  data: z.string().optional(),
});

export const updateAnalyticsFormSchema = z.object({
  event: z.string().min(1, "Event is required"),
  data: z.string().optional(),
});

export const createReportFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateReportFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createDashboardFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateDashboardFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createIntegrationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateIntegrationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createWebhookFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
});

export const updateWebhookFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
});

export const createApiTokenFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  token: z.string().min(1, "Token is required"),
});

export const updateApiTokenFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  token: z.string().min(1, "Token is required"),
});

export const createRoleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateRoleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createPermissionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updatePermissionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createAuditLogFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  action: z.string().min(1, "Action is required"),
  timestamp: z.date().min(new Date(), "Timestamp is required"),
});

export const updateAuditLogFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  action: z.string().min(1, "Action is required"),
  timestamp: z.date().min(new Date(), "Timestamp is required"),
});

export const createBackupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateBackupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createRestoreFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateRestoreFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createMigrationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateMigrationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createSeedFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateSeedFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createCronJobFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  schedule: z.string().min(1, "Schedule is required"),
});

export const updateCronJobFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  schedule: z.string().min(1, "Schedule is required"),
});

export const createQueueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateQueueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createEventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const updateEventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export const createCommandFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  command: z.string().min(1, "Command is required"),
});

export const updateCommandFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  command: z.string().min(1, "Command is required"),
});

export const createTaskFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateTaskFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createJobFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateJobFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createWorkerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateWorkerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createQueueMonitorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateQueueMonitorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createCacheFormSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

export const updateCacheFormSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

export const createStorageFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  path: z.string().min(1, "Path is required"),
});

export const updateStorageFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  path: z.string().min(1, "Path is required"),
});

export const createSearchFormSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export const updateSearchFormSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export const createNotificationTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const updateNotificationTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const createEmailTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const updateEmailTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const createSmsTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  body: z.string().min(1, "Body is required"),
});

export const updateSmsTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  body: z.string().min(1, "Body is required"),
});

export const createPushNotificationTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export const updatePushNotificationTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export const createChatFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  message: z.string().min(1, "Message is required"),
});

export const updateChatFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  message: z.string().min(1, "Message is required"),
});

export const createForumFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateForumFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createCommentFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  entityId: z.string().min(1, "Entity ID is required"),
  entityType: z.string().min(1, "Entity type is required"),
  comment: z.string().min(1, "Comment is required"),
});

export const updateCommentFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  entityId: z.string().min(1, "Entity ID is required"),
  entityType: z.string().min(1, "Entity type is required"),
  comment: z.string().min(1, "Comment is required"),
});