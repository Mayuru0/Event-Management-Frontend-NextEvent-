import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
        <Card className="w-full max-w-lg text-center p-6 sm:p-8 rounded-xl shadow-2xl">
            <CardHeader className="p-0">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div className="mt-4">
                    <CardTitle className="text-3xl font-headline">Payment Successful</CardTitle>
                    <CardDescription className="mt-2 text-lg">
                        Thank you for your purchase.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="mt-6 p-0">
                <p className="text-muted-foreground">
                    Your order is being processed and you will receive a confirmation email shortly.
                </p>
                <Button asChild size="lg" className="mt-8 w-full">
                    <Link href="/">
                        Back to Store <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </main>
  );
}
