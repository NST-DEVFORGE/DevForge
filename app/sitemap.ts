import { MetadataRoute } from 'next'
import { studentsData } from '@/data/students'

const BASE_URL = 'https://www.devforge.club'

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/club`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/journey`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/opensource`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/pr-stats`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/quality-prs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
        { url: `${BASE_URL}/gsoc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/gssoc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/esoc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
        { url: `${BASE_URL}/hackathons`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/conferences`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
        { url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ]

    const studentRoutes: MetadataRoute.Sitemap = studentsData.map((s) => ({
        url: `${BASE_URL}/students/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    }))

    return [...staticRoutes, ...studentRoutes]
}
